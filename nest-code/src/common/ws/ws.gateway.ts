import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { WsService } from './ws.service';

@WebSocketGateway({ path: '/ws' })
export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly wsService: WsService) {}

  afterInit(server: Server) {
    this.wsService.setServer(server);
    console.log('[WS] WebSocket Gateway initialized at /ws');
    console.log('[WS] Registered data fetchers:', this.wsService.getRegisteredModules());
  }

  handleConnection(client: WebSocket) {
    console.log(`[WS] Client connected`);
    
    // 手动监听消息事件（原生 WebSocket 必须这样做）
    client.on('message', async (data: Buffer) => {
      const payload = data.toString();
      console.log(`[WS] Received raw message:`, payload);
      
      let parsedData;
      try {
        parsedData = JSON.parse(payload);
      } catch (e) {
        console.error('[WS] Invalid JSON:', e);
        return;
      }

      const { action, module, data: msgData, params } = parsedData;

      console.log(`[WS] Parsed message: action=${action}, module=${module}`);

      switch (action) {
        case 'subscribe':
          console.log(`[WS] Processing subscribe for module: ${module}, params:`, params);
          await this.wsService.subscribe(client, module, params);
          break;
        case 'unsubscribe':
          await this.wsService.unsubscribe(client, module);
          break;
        case 'publish':
          this.wsService.publish(module, msgData);
          break;
        default:
          console.error(`[WS] Unknown action: ${action}`);
      }
    });
  }

  handleDisconnect(client: WebSocket) {
    this.wsService.handleDisconnect(client);
    console.log(`[WS] Client disconnected`);
  }
}
