import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogServiceBase } from './generated/log.service';
import { LogEntity } from './generated/log.entity';
import { CreateLogDto } from './generated/dto/create-log.dto';
import { UpdateLogDto } from './generated/dto/update-log.dto';
import { WsService } from '../../common/ws';
// 导入可复用的参数类型和返回类型
import type { ListQuery, IdQuery, LogFindAllReturn, LogRemoveReturn } from './generated/log.types';

@Injectable()
export class LogService extends LogServiceBase implements OnModuleInit {
  /** 保存上次订阅的参数 */
  private lastParams: Record<string, any> = { page: 1, pageSize: 20 };

  constructor(
    @InjectRepository(LogEntity)
    protected readonly repo: Repository<LogEntity>,
    private readonly wsService: WsService,
  ) {
    super(repo);
  }

  onModuleInit() {
    this.wsService.registerDataFetcher('system/log', async (params) => {
      // 更新上次订阅的参数
      this.lastParams = params || { page: 1, pageSize: 20 };
      const result = await super.findAll(this.lastParams);
      return result;
    });
    console.log('[LogService] Registered WS data fetcher for system/log');
  }

  /** 查询日志列表 */
  async findAll(query?: Record<string, any>): Promise<LogFindAllReturn> {
    return super.findAll(query);
  }

  /** 添加日志（通过 WS 实时推送） */
  async create(body: Partial<CreateLogDto>) {
    const record = await super.create(body);
    this.pushData();
    return record;
  }

  /** 删除日志（通知 WS 更新列表） */
  async remove(body: Partial<IdQuery>): Promise<LogRemoveReturn> {
    const result = await super.remove(body);
    this.pushData();
    return result;
  }

  /** 查询并推送最新数据到 WS 订阅者 */
  private async pushData() {
    try {
      // 使用保存在本服务中的上次订阅参数
      const result = await super.findAll(this.lastParams);
      this.wsService.publish('system/log', result);
      console.log(`[LogService] Pushed data with params:`, this.lastParams);
    } catch (error) {
      console.error('[LogService] Error pushing data:', error);
    }
  }
}
