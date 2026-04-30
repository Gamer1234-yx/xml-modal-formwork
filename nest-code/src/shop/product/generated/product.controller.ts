/**
 * 商品 Controller（标准接口）
 * 自动生成 - 来源：product.xml
 * ⚠️ 此文件每次重新生成都会被覆盖，请勿在此写业务逻辑
 *    自定义接口逻辑请写在上级目录的 product.controller.ts 中
 */

import { Controller, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
// 注入自定义 Service（位于上级目录），以确保自定义逻辑生效
import { ProductService } from '../product.service';
import { ProductEntity } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
// 导入可复用的参数类型和返回类型
import type { ListQuery, IdQuery, ProductFindAllReturn, ProductRemoveReturn } from './product.types';

@ApiTags('商品')
@Controller('shop/product')
export class ProductControllerBase {
  constructor(protected readonly productService: ProductService) {}

  @ApiOperation({ summary: '查询商品列表' })
  @Post('list')
  async findAll(@Body() query: ListQuery): Promise<ProductFindAllReturn> {
    return this.productService.findAll(query);
  }

  @ApiOperation({ summary: '查询商品详情' })
  @Post('detail')
  async findOne(@Body() idQuery: any): Promise<ProductEntity> {
    return this.productService.findOne(idQuery);
  }

  @ApiOperation({ summary: '新建商品' })
  @Post('create')
  async create(@Body() body: Partial<ProductEntity>): Promise<ProductEntity> {
    return this.productService.create(body);
  }

  @ApiOperation({ summary: '更新商品' })
  @Post('update')
  async update(@Body() body: Partial<ProductEntity>): Promise<ProductEntity> {
    return this.productService.update(body);
  }

  @ApiOperation({ summary: '删除商品' })
  @Post('delete')
  async remove(@Body() idQuery: any): Promise<ProductRemoveReturn> {
    return this.productService.remove(idQuery);
  }

}