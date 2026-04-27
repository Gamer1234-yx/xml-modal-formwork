/**
 * 商品 API 服务
 * 自动生成 - 来源：product.xml
 */

import request from '@/utils/request';
import type { IProduct } from './Product.model';

const BASE_URL = '/api/shop/product';

export const ProductApi = {
  /** 查询列表 */
  list(params?: Record<string, any>) {
    return request.get<{ list: IProduct[]; total: number }>(BASE_URL, { params });
  },

  /** 查询详情 */
  detail(id: number | string) {
    return request.get<IProduct>(`${BASE_URL}/${id}`);
  },

  /** 新建 */
  create(data: Partial<IProduct>) {
    return request.post<IProduct>(BASE_URL, data);
  },

  /** 更新 */
  update(id: number | string, data: Partial<IProduct>) {
    return request.put<IProduct>(`${BASE_URL}/${id}`, data);
  },

  /** 删除 */
  remove(id: number | string) {
    return request.delete(`${BASE_URL}/${id}`);
  },
};

export default ProductApi;