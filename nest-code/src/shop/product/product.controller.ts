/**
 * 商品 Controller
 * 自动生成 - 来源：product.xml
 */

import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('商品')
@Controller('shop/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: '查询商品列表' })
  @Post()
  findAll(@Query() query: Record<string, any>) {
    return this.productService.findAll(query);
  }

  @ApiOperation({ summary: '查询商品详情' })
  @Post(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @ApiOperation({ summary: '新建商品' })
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @ApiOperation({ summary: '更新商品' })
  @Post(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @ApiOperation({ summary: '删除商品' })
  @Post(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }

}