import { Injectable } from '@nestjs/common';
import { Server, WebSocket } from 'ws';

interface Subscription {
  client: WebSocket;
  module: string;
  params?: Record<string, any>;
}

interface ModuleData {
  data: any[];
  lastParams?: Record<string, any>;
}

type DataFetcher = (params?: Record<string, any>) => Promise<any>;

@Injectable()
export class WsService {
  private subscriptions: Subscription[] = [];
  private moduleData: Record<string, ModuleData> = {};
  private server: Server;
  private dataFetchers: Map<string, DataFetcher> = new Map();

  setServer(server: Server) {
    this.server = server;
  }

  registerDataFetcher(module: string, fetcher: DataFetcher) {
    this.dataFetchers.set(module, fetcher);
    console.log(`[WsService] Registered data fetcher for module: ${module}`);
  }

  getRegisteredModules(): string[] {
    return Array.from(this.dataFetchers.keys());
  }

  async subscribe(client: WebSocket, module: string, params?: Record<string, any>) {
    if (!this.moduleData[module]) {
      this.moduleData[module] = { data: [] };
    }

    // 保存最后一次订阅的参数
    this.moduleData[module].lastParams = params;

    const existing = this.subscriptions.find(
      (s) => s.client === client && s.module === module
    );
    if (!existing) {
      this.subscriptions.push({ client, module, params });
      console.log(`[WsService] Client subscribed to ${module}, total subscribers for this module: ${this.getSubscriberCount(module)}`);
    }

    const fetcher = this.dataFetchers.get(module);
    console.log(`[WsService] Looking up data fetcher for '${module}':`, fetcher ? 'FOUND' : 'NOT FOUND');
    
    if (fetcher) {
      try {
        console.log(`[WsService] Fetching data for ${module} with params:`, params);
        const result = await fetcher(params);
        console.log(`[WsService] Fetched result for ${module}:`, JSON.stringify(result));
        
        if (result && typeof result === 'object') {
          // 存储完整结果
          this.moduleData[module].data = Array.isArray(result.list || result.data) 
            ? (result.list || result.data).slice(0, 20)
            : [result];
          
          // 发送完整结果给前端
          const sendData = { module, ...result };
          console.log(`[WsService] Sending to client for ${module}:`, JSON.stringify(sendData));
          this.sendToClient(client, sendData);
        }
      } catch (error) {
        console.error(`[WsService] Error fetching data for ${module}:`, error);
      }
    } else if (this.moduleData[module]?.data?.length > 0) {
      this.sendToClient(client, { module, list: this.moduleData[module].data });
    }
  }

  /** 获取指定模块最后一次订阅的参数 */
  getLastParams(module: string): Record<string, any> | undefined {
    return this.moduleData[module]?.lastParams;
  }

  unsubscribe(client: WebSocket, module: string) {
    const index = this.subscriptions.findIndex(
      (s) => s.client === client && s.module === module
    );
    if (index !== -1) {
      this.subscriptions.splice(index, 1);
      console.log(`[WsService] Client unsubscribed from ${module}`);
    }

    const hasOtherSubs = this.subscriptions.some((s) => s.client === client);
    if (!hasOtherSubs) {
      delete this.moduleData[module];
    }
  }

  publish(module: string, data: any) {
    if (Array.isArray(data)) {
      this.moduleData[module].data = data.slice(0, 20);
    } else if (data?.list) {
      this.moduleData[module].data = data.list.slice(0, 20);
    } else {
      this.moduleData[module].data.unshift(data);
      if (this.moduleData[module].data.length > 20) {
        this.moduleData[module].data.pop();
      }
    }

    const message = JSON.stringify({ module, ...data });
    console.log(`[WsService] Publishing to ${module}:`, this.getSubscriberCount(module), 'subscribers');
    this.subscriptions
      .filter((s) => s.module === module)
      .forEach((s) => {
        if (s.client.readyState === WebSocket.OPEN) {
          s.client.send(message);
        }
      });
  }

  handleDisconnect(client: WebSocket) {
    const modulesToRemove = new Set<string>();
    this.subscriptions = this.subscriptions.filter((s) => {
      if (s.client === client) {
        modulesToRemove.add(s.module);
        console.log(`[WsService] Client removed from ${s.module} due to disconnect`);
        return false;
      }
      return true;
    });

    modulesToRemove.forEach((module) => {
      const hasOtherSubs = this.subscriptions.some((s) => s.module === module);
      if (!hasOtherSubs) {
        delete this.moduleData[module];
      }
    });
  }

  getModuleData(module: string): ModuleData | undefined {
    return this.moduleData[module];
  }

  getSubscriptions(): Subscription[] {
    return this.subscriptions;
  }

  getSubscriberCount(module: string): number {
    return this.subscriptions.filter(s => s.module === module).length;
  }

  private sendToClient(client: WebSocket, data: any) {
    if (client.readyState === WebSocket.OPEN) {
      const jsonStr = JSON.stringify(data);
      console.log(`[WsService] Sending message to client (${jsonStr.length} bytes):`, jsonStr.substring(0, 200));
      client.send(jsonStr);
    } else {
      console.error(`[WsService] Cannot send - client not ready (state: ${client.readyState})`);
    }
  }
}
