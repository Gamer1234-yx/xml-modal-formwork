/**
 * 商品 可复用的参数类型和返回类型（Vue 端）
 * 自动生成 - 来源：product.xml
 * ⚠️ 此文件每次重新生成都会被覆盖
 */

import type { IProduct } from './product.model';

export interface ListQuery {
  page?: number;
  pageSize?: number;
  name?: string;
  categoryId?: number;
}

export interface IdQuery {
  id: number;
}

export type ProductFindAllReturn = { list: IProduct[]; total: number; page: number; pageSize: number; };
export type ProductRemoveReturn = { message: string; };
