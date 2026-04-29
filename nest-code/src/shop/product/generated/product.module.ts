/**
 * 商品 Module（标准实现）
 * 自动生成 - 来源：product.xml
 * ⚠️ 此文件每次重新生成都会被覆盖
 *    自定义模块配置请修改上级目录的 product.module.ts
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { ProductService } from '../product.service';
import { ProductController } from '../product.controller';

export const PRODUCT_MODULE_BASE_CONFIG = {
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
};

@Module(PRODUCT_MODULE_BASE_CONFIG)
export class ProductModuleBase {}