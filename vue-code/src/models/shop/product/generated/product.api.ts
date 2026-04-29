/**
 * 商品 API 服务（标准实现）
 * 自动生成 - 来源：product.xml
 * ⚠️ 此文件每次重新生成都会被覆盖
 *    自定义请求逻辑请写在同目录的 product.api.ts 中
 */

import request from '@/utils/request';
import type { IProduct } from './product.model';
import type { ListQuery, DetailQuery, DeleteQuery, ProductListReturn, ProductDeleteReturn } from './product.types';

const BASE_URL = '/api/shop/product';

export class ProductApiBase {
  /** 查询商品列表 */
  list(query: ListQuery): Promise<ProductListReturn> {
    return request.post<ProductListReturn>(BASE_URL, query);
  }

  /** 查询商品详情 */
  detail(query: DetailQuery): Promise<IProduct> {
    return request.post<IProduct>(BASE_URL, query);
  }

  /** 新建商品 */
  create(body: Partial<IProduct>): Promise<IProduct> {
    return request.post<IProduct>(BASE_URL, body);
  }

  /** 更新商品 */
  update(data: { id: number, body: Partial<IProduct> }): Promise<IProduct> {
    return request.post<IProduct>(BASE_URL, data);
  }

  /** 删除商品 */
  remove(query: DeleteQuery): Promise<ProductDeleteReturn> {
    return request.post<ProductDeleteReturn>(BASE_URL, query);
  }

}

export default ProductApiBase;