/**
 * 商品 Service
 * 自动生成 - 来源：product.xml
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ProductEntity } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
  ) {}

  async findAll(query: Record<string, any> = {}) {
    const { page = 1, pageSize = 20, ...filters } = query;
    const where: any = {};
    if (filters.name !== undefined) where.name = Like(`%${filters.name}%`);
    if (filters.categoryId !== undefined) where.categoryId = Like(`%${filters.categoryId}%`);
    if (filters.sku !== undefined) where.sku = Like(`%${filters.sku}%`);
    const [list, total] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { id: 'DESC' },
    });
    return { list, total, page: +page, pageSize: +pageSize };
  }

  async findOne(id: number) {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException(`商品 id=${id} 不存在`);
    return record;
  }

  async create(dto: CreateProductDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: '删除成功' };
  }
}