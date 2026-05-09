import { Injectable, OnModuleInit } from '@nestjs/common';
import { WsService } from './ws.service';

/**
 * WebSocket 实体服务辅助类
 * 提供 WS 订阅、数据推送等通用方法
 *
 * 使用方式 - 在 Service 中组合使用：
 *   export class LogService extends LogServiceBase implements OnModuleInit {
 *     protected wsHelper = new WsEntityHelper(wsService);
 *     
 *     onModuleInit() {
 *       this.wsHelper.init(this, 'system/log');
 *     }
 *   }
 */
@Injectable()
export class WsEntityHelper {
  private wsModule!: string;
  private serviceInstance!: any;

  constructor(private readonly wsService: WsService) {}

  /**
   * 初始化 WS 功能
   * @param service 服务实例（用于调用 findAll）
   * @param module WS 模块名称
   */
  init(service: any, module: string) {
    this.serviceInstance = service;
    this.wsModule = module;

    this.wsService.registerDataFetcher(module, async (params) => {
      const finalParams = params || { page: 1, pageSize: 20 };
      const result = await this.serviceInstance.findAll(finalParams);
      return result;
    });
    console.log(`[WsEntityHelper] Registered WS data fetcher for ${module}`);
  }

  /**
   * 推送最新数据到所有订阅者（按各自参数独立查询）
   */
  async pushData() {
    try {
      const subscribers = this.wsService.getSubscriptionsByModule(this.wsModule);
      
      if (!subscribers || subscribers.length === 0) return;

      console.log(`[WsEntityHelper][${this.wsModule}] Pushing data to ${subscribers.length} subscriber(s)`);

      // 为每个订阅者独立查询和推送
      for (const sub of subscribers) {
        if (sub.client.readyState !== 1) continue; // WebSocket.OPEN = 1
        
        try {
          const params = sub.params || { page: 1, pageSize: 20 };
          const result = await this.serviceInstance.findAll(params);
          
          const message = JSON.stringify({ module: this.wsModule, ...result });
          sub.client.send(message);
          
          console.log(`[WsEntityHelper][${this.wsModule}] Pushed to subscriber with params:`, params);
        } catch (error) {
          console.error(`[WsEntityHelper][${this.wsModule}] Error pushing to subscriber:`, error);
        }
      }
    } catch (error) {
      console.error(`[WsEntityHelper][${this.wsModule}] Error in pushData:`, error);
    }
  }
}
