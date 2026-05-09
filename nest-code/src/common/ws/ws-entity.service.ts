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
  /** 保存上次订阅的参数 */
  lastParams: Record<string, any> = { page: 1, pageSize: 20 };
  
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
      this.lastParams = params || { page: 1, pageSize: 20 };
      const result = await this.serviceInstance.findAll(this.lastParams);
      return result;
    });
    console.log(`[WsEntityHelper] Registered WS data fetcher for ${module}`);
  }

  /** 推送最新数据到 WS 订阅者 */
  async pushData() {
    try {
      const result = await this.serviceInstance.findAll(this.lastParams);
      this.wsService.publish(this.wsModule, result);
      console.log(`[WsEntityHelper][${this.wsModule}] Pushed data with params:`, this.lastParams);
    } catch (error) {
      console.error(`[WsEntityHelper][${this.wsModule}] Error pushing data:`, error);
    }
  }
}
