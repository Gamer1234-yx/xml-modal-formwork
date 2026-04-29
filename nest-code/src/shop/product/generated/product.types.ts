/**
 * 商品 可复用的参数类型和返回类型
 * 自动生成 - 来源：product.xml
 * ⚠️ 此文件每次重新生成都会被覆盖
 */

import type { ProductEntity } from './product.entity';

export interface ListQuery {
  page?: number;
  pageSize?: number;
  name?: string;
  categoryId?: number;
}

export interface DetailQuery {
  id: number;
}

export interface DeleteQuery {
  id: number;
}

export type ProductListReturn = { list: ProductEntity[]; total: number; page: number; pageSize: number; };
export type ProductDeleteReturn = { message: string; };
