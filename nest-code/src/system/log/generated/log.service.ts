/**
 * 日志 Service（标准实现）
 * 自动生成 - 来源：log.xml
 * ⚠️ 此文件每次重新生成都会被覆盖，请勿在此写业务逻辑
 *    自定义逻辑请写在上级目录的 log.service.ts 中
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { LogEntity } from './log.entity';
// 导入可复用的参数类型和返回类型
import type { ListQuery, IdQuery, LogFindAllReturn, LogRemoveReturn } from './log.types';

@Injectable()
export class LogServiceBase {
  constructor(
    @InjectRepository(LogEntity)
    protected readonly repo: Repository<LogEntity>,
  ) {}

  /** 查询日志列表 */
  async findAll(query: any): Promise<any> {
    const { page = 1, pageSize = 20, ...where } = query || {};
    const whereConditions: Record<string, any> = {};
    Object.keys(where).forEach(key => {
      const value = where[key];
      if (typeof value === 'string') {
        whereConditions[key] = Like(`%${value}%`);
      } else {
        whereConditions[key] = value;
      }
    });
    const [list, total] = await this.repo.findAndCount({
      where: Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { id: 'DESC' },
    });
    return { list, total, page: +page, pageSize: +pageSize };
  }

  /** 查询日志详情 */
  async findOne(body: Partial<LogEntity>): Promise<LogEntity> {
    const record = await this.repo.findOne({ where: { id: body.id } });
    if (!record) throw new NotFoundException(`日志 id=${body.id} 不存在`);
    return record;
  }

  /** 添加日志 */
  async create(body: Partial<LogEntity>): Promise<LogEntity> {
    const entity = this.repo.create(body);
    return this.repo.save(entity);
  }

  /** 删除日志 */
  async remove(body: Partial<LogEntity>): Promise<{ message: string }> {
    await this.findOne(body);
    await this.repo.delete(body.id);
    return { message: '删除成功' };
  }

}