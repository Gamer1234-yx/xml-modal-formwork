/**
 * 商品 API 服务（标准实现）
 * 自动生成 - 来源：product.xml
 * ⚠️ 此文件每次重新生成都会被覆盖
 *    自定义请求逻辑请写在同目录的 product.api.ts 中
 */

import request from '@/utils/request';
import type { ApiResponse } from '@/utils/request';
import type { IProduct } from './product.model';
import type { ListQuery, DetailQuery, DeleteQuery, ProductFindAllReturn, ProductRemoveReturn } from './product.types';

const BASE_URL = '/shop/product';

export class ProductApiBase {
  /** 查询商品列表 */
  findAll(query: ListQuery): Promise<ApiResponse<ProductFindAllReturn>> {
    return request.post<ApiResponse<ProductFindAllReturn>>(`${BASE_URL}/list`, query);
  }

  /** 查询商品详情 */
  findOne(id: number): Promise<ApiResponse<IProduct>> {
    return request.post<ApiResponse<IProduct>>(`${BASE_URL}/detail`, id);
  }

  /** 新建商品 */
  create(body: Partial<IProduct>): Promise<ApiResponse<IProduct>> {
    return request.post<ApiResponse<IProduct>>(`${BASE_URL}/create`, body);
  }

  /** 更新商品 */
  update(body: Partial<IProduct>): Promise<ApiResponse<IProduct>> {
    return request.post<ApiResponse<IProduct>>(`${BASE_URL}/update`, body);
  }

  /** 删除商品 */
  remove(id: number): Promise<ApiResponse<ProductRemoveReturn>> {
    return request.post<ApiResponse<ProductRemoveReturn>>(`${BASE_URL}/delete`, id);
  }

}

export default ProductApiBase;