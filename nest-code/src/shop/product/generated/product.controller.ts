/**
 * 商品 Controller（标准接口）
 * 自动生成 - 来源：product.xml
 * ⚠️ 此文件每次重新生成都会被覆盖，请勿在此写业务逻辑
 *    自定义接口逻辑请写在上级目录的 product.controller.ts 中
 */

import { Controller, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
// 注入自定义 Service（位于上级目录），以确保自定义逻辑生效
import { ProductService } from '../product.service';
import { ProductEntity } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
// 导入可复用的参数类型和返回类型
import type { ListQuery, DetailQuery, DeleteQuery, ProductListReturn, ProductDeleteReturn } from './product.types';

@ApiTags('商品')
@Controller('shop/product')
export class ProductControllerBase {
  constructor(protected readonly productService: ProductService) {}

  @ApiOperation({ summary: '查询商品列表' })
  @Post('list')
  async list(@Body() query: ListQuery): Promise<ProductListReturn> {
    return this.productService.findAll(query);
  }

  @ApiOperation({ summary: '查询商品详情' })
  @Post('detail')
  async detail(@Body() query: DetailQuery): Promise<ProductEntity> {
    return this.productService.findOne(query.id);
  }

  @ApiOperation({ summary: '新建商品' })
  @Post('create')
  async create(@Body() dto: CreateProductDto): Promise<ProductEntity> {
    return this.productService.create(dto);
  }

  @ApiOperation({ summary: '更新商品' })
  @Post('update')
  async update(@Body() dto: UpdateProductDto & { id: number }): Promise<ProductEntity> {
    return this.productService.update(dto.id, dto);
  }

  @ApiOperation({ summary: '删除商品' })
  @Post('delete')
  async delete(@Body() query: DeleteQuery): Promise<ProductDeleteReturn> {
    return this.productService.remove(query.id);
  }

}