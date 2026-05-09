import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogServiceBase } from './generated/log.service';
import { LogEntity } from './generated/log.entity';
import { CreateLogDto } from './generated/dto/create-log.dto';
import { UpdateLogDto } from './generated/dto/update-log.dto';
import { WsEntityHelper } from '../../common/ws/ws-entity.service';
import { WsService } from '../../common/ws';
// 导入可复用的参数类型和返回类型
import type { ListQuery, IdQuery, LogFindAllReturn, LogRemoveReturn } from './generated/log.types';

@Injectable()
export class LogService extends LogServiceBase implements OnModuleInit {
  protected wsHelper: WsEntityHelper;

  constructor(
    @InjectRepository(LogEntity)
    protected readonly repo: Repository<LogEntity>,
    wsService: WsService,
  ) {
    super(repo);
    this.wsHelper = new WsEntityHelper(wsService);
  }

  onModuleInit() {
    this.wsHelper.init(this, 'system/log');
  }

  /** 查询日志列表 */
  async findAll(query?: Record<string, any>): Promise<LogFindAllReturn> {
    return super.findAll(query);
  }

  /** 添加日志（通过 WS 实时推送） */
  async create(body: Partial<CreateLogDto>) {
    const record = await super.create(body);
    this.wsHelper.pushData();
    return record;
  }

  /** 删除日志（通知 WS 更新列表） */
  async remove(body: Partial<IdQuery>): Promise<LogRemoveReturn> {
    const result = await super.remove(body);
    this.wsHelper.pushData();
    return result;
  }
}
