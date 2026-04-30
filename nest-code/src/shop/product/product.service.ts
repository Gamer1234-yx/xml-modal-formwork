/**
 * 商品 Service（自定义业务逻辑）
 * 此文件不会被生成器覆盖，请在此处编写自定义查询逻辑
 *
 * 使用方式：
 *   1. 直接重写基类方法（会完全替换基类逻辑）
 *   2. 调用 super.xxx() 复用基类逻辑，再追加自定义处理
 *   3. 新增完全自定义的方法
 *
 * 示例：
 *   async findAll(query?: Record<string, any>) {
 *     // 自定义：追加权限过滤、联表查询等
 *     return super.findAll(query);
 *   }
 */

import { Injectable } from '@nestjs/common';
import { ProductServiceBase } from './generated/product.service';
import { CreateProductDto } from './generated/dto/create-product.dto';
import { UpdateProductDto } from './generated/dto/update-product.dto';
// 导入可复用的参数类型和返回类型
import type { ListQuery, IdQuery, ProductFindAllReturn, ProductRemoveReturn } from './generated/product.types';

@Injectable()
export class ProductService extends ProductServiceBase {
  // 可在此处重写或扩展业务逻辑
  // 示例：自定义查询逻辑
  // async findAll(query?: Record<string, any>) {
  //   // 在这里加自定义过滤逻辑
  //   return super.findAll(query);
  // }
}