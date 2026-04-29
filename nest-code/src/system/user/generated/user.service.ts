/**
 * 用户 Service（标准实现）
 * 自动生成 - 来源：user.xml
 * ⚠️ 此文件每次重新生成都会被覆盖，请勿在此写业务逻辑
 *    自定义逻辑请写在上级目录的 user.service.ts 中
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserServiceBase {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly repo: Repository<UserEntity>,
  ) {}

  /**
   * 查询列表（支持分页 + 模糊搜索）
   * 自定义查询逻辑：在上级目录的 user.service.ts 中重写此方法
   */
  async findAll(query: Record<string, any> = {}): Promise<{ list: UserEntity[]; total: number; page: number; pageSize: number }> {
    const { page = 1, pageSize = 20, ...filters } = query;
    const where: any = {};
    if (filters.username !== undefined && filters.username !== '') {
      where.username = Like(`%${filters.username}%`);
    }
    if (filters.email !== undefined && filters.email !== '') {
      where.email = Like(`%${filters.email}%`);
    }
    const [list, total] = await this.repo.findAndCount({
      where,
      skip: (page -1) * pageSize,
      take: pageSize,
      order: { id: 'DESC' },
    });
    return { list, total, page: +page, pageSize: +pageSize };
  }

  /** 查询单条记录 */
  async findOne(id: number): Promise<UserEntity> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`用户 id=${id} 不存在`);
    return record;
  }

  /** 新建记录 */
  async create(dto: CreateUserDto): Promise<UserEntity> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  /** 更新记录 */
  async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    await this.findOne(id);
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  /** 删除记录 */
  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: '删除成功' };
  }
}