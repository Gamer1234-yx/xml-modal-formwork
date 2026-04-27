/**
 * 商品 数据模型
 * 自动生成 - 来源：product.xml
 * 请勿手动修改，重新生成会覆盖此文件
 */

export interface IProduct {
  /** ID */
  id?: number;
  /** 商品名称 */
  name: string;
  /** 分类 */
  categoryId: string | number;
  /** 价格(元) */
  price: number;
  /** 库存 */
  stock: number;
  /** SKU编码 */
  sku?: string;
  /** 商品图片 */
  images?: string[];
  /** 商品描述 */
  description?: string;
  /** 上架状态 */
  status: string | number;
  /** 排序 */
  sort?: number;
  /** 创建时间 */
  createdAt?: string;
}

export class ProductModel implements IProduct {
  /** ID */
  id: number = 0;
  /** 商品名称 */
  name: string = '';
  /** 分类 */
  categoryId: string | number = '';
  /** 价格(元) */
  price: number = 0;
  /** 库存 */
  stock: number = 0;
  /** SKU编码 */
  sku: string = '';
  /** 商品图片 */
  images: string[] = [];
  /** 商品描述 */
  description: string = '';
  /** 上架状态 */
  status: string | number = '0';
  /** 排序 */
  sort: number = 0;
  /** 创建时间 */
  createdAt: string = '';

  constructor(data?: Partial<IProduct>) {
    if (data) Object.assign(this, data);
  }

  /** 转为纯 JSON 对象 */
  toJSON(): IProduct {
    return { ...this };
  }
}

export default ProductModel;