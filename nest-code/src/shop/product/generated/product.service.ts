/**
 * 商品 Service（标准实现）
 * 自动生成 - 来源：product.xml
 * ⚠️ 此文件每次重新生成都会被覆盖，请勿在此写业务逻辑
 *    自定义逻辑请写在上级目录的 product.service.ts 中
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductServiceBase {
  constructor(
    @InjectRepository(ProductEntity)
    protected readonly repo: Repository<ProductEntity>,
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
  async findOne(body: Partial<ProductEntity>): Promise<ProductEntity> {
    const record = await this.repo.findOne({ where: { id: body.id } });
    if (!record) throw new NotFoundException(`商品 id=${body.id} 不存在`);
    return record;
  }

  /** 新建 */
  async create(body: Partial<ProductEntity>): Promise<ProductEntity> {
    const entity = this.repo.create(body);
    return this.repo.save(entity);
  }

  /** 更新 */
  async update(body: Partial<ProductEntity>): Promise<ProductEntity> {
    await this.findOne(body);
    await this.repo.update(body.id, body);
    return this.findOne(body);
  }

  /** 删除 */
  async remove(body: Partial<ProductEntity>): Promise<{ message: string }> {
    await this.findOne(body);
    await this.repo.delete(body.id);
    return { message: '删除成功' };
  }

}