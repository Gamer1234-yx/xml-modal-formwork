/**
 * 商品 Service（标准实现）
 * 自动生成 - 来源：product.xml
 * ⚠️ 此文件每次重新生成都会被覆盖，请勿在此写业务逻辑
 *    自定义逻辑请写在上级目录的 product.service.ts 中
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { ProductEntity } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductServiceBase {
  constructor(
    @InjectRepository(ProductEntity)
    protected readonly repo: Repository<ProductEntity>,
  ) {}

  /**
   * 查询列表（支持分页 + 模糊搜索）
   * 自定义查询逻辑：在上级目录的 product.service.ts 中重写此方法
   */
  async findAll(query: Record<string, any> = {}): Promise<{ list: ProductEntity[]; total: number; page: number; pageSize: number }> {
    const { page = 1, pageSize = 20, ...filters } = query;
    const where: any = {};
    if (filters.name !== undefined && filters.name !== '') {
      where.name = Like(`%${filters.name}%`);
    }
    if (filters.categoryId !== undefined && filters.categoryId !== '') {
      where.categoryId = Like(`%${filters.categoryId}%`);
    }
    if (filters.sku !== undefined && filters.sku !== '') {
      where.sku = Like(`%${filters.sku}%`);
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
  async findOne(id: number): Promise<ProductEntity> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`商品 id=${id} 不存在`);
    return record;
  }

  /** 新建记录 */
  async create(dto: CreateProductDto): Promise<ProductEntity> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  /** 更新记录 */
  async update(id: number, dto: UpdateProductDto): Promise<ProductEntity> {
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