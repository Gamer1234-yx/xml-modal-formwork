/**
 * 用户 Service（标准实现）
 * 自动生成 - 来源：user.xml
 * ⚠️ 此文件每次重新生成都会被覆盖，请勿在此写业务逻辑
 *    自定义逻辑请写在上级目录的 user.service.ts 中
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserServiceBase {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly repo: Repository<UserEntity>,
  ) {}

  /** 查询列表 */
  async findAll(query: any): Promise<any> {
    const { page = 1, pageSize = 20 } = query || {};
    const [list, total] = await this.repo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { id: 'DESC' },
    });
    return { list, total, page: +page, pageSize: +pageSize };
  }

  /** 查询单条 */
  async findOne(id: number): Promise<UserEntity> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`用户 id=${id} 不存在`);
    return record;
  }

  /** 新建 */
  async create(body: Partial<UserEntity>): Promise<UserEntity> {
    const entity = this.repo.create(body);
    return this.repo.save(entity);
  }

  /** 更新 */
  async update(body: Partial<UserEntity>): Promise<UserEntity> {
    await this.findOne(body.id);
    await this.repo.update(body.id, body);
    return this.findOne(body.id);
  }

  /** 删除 */
  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: '删除成功' };
  }

  /** 自定义方法 */
  async customUpdate(body: Partial<UserEntity>): Promise<UserEntity> {
    // TODO: 实现 customUpdate 方法的业务逻辑
    return void 0 as UserEntity
  }
}