/**
 * 商品 数据模型
 * 自动生成 - 来源：product.xml
 * ⚠️ 此文件每次重新生成都会被覆盖
 */

import type { FieldConfig } from '@/models/common/types';

export interface IProduct {
  /** ID */
  id?: FieldConfig;
  /** 商品名称 */
  name: FieldConfig;
  /** 分类 */
  categoryId: FieldConfig;
  /** 价格(元) */
  price: FieldConfig;
  /** 库存 */
  stock: FieldConfig;
  /** SKU编码 */
  sku?: FieldConfig;
  /** 商品图片 */
  images?: FieldConfig;
  /** 商品描述 */
  description?: FieldConfig;
  /** 上架状态 */
  status: FieldConfig;
  /** 排序 */
  sort?: FieldConfig;
  /** 创建时间 */
  createdAt?: FieldConfig;
}

export class ProductModel implements IProduct {
  /** ID */
  id: FieldConfig = {
    name: 'id',
    label: 'ID',
    type: 'number',
    value: 0,
    default: 0,
    primary: true,
    visible: false,
    searchable: false,
    readonly: false,
  };
  /** 商品名称 */
  name: FieldConfig = {
    name: 'name',
    label: '商品名称',
    type: 'string',
    value: '',
    default: '',
    primary: false,
    visible: true,
    searchable: true,
    readonly: false,
  };
  /** 分类 */
  categoryId: FieldConfig = {
    name: 'categoryId',
    label: '分类',
    type: 'select',
    value: '',
    default: '',
    primary: false,
    visible: true,
    searchable: true,
    readonly: false, options: [{ value: '类别1', label: '类别1' }, { value: '类别2', label: '类别2' }, { value: '类别3', label: '类别3' }],
  };
  /** 价格(元) */
  price: FieldConfig = {
    name: 'price',
    label: '价格(元)',
    type: 'number',
    value: 0,
    default: 0,
    primary: false,
    visible: true,
    searchable: false,
    readonly: false,
  };
  /** 库存 */
  stock: FieldConfig = {
    name: 'stock',
    label: '库存',
    type: 'number',
    value: 0,
    default: 0,
    primary: false,
    visible: true,
    searchable: false,
    readonly: false,
  };
  /** SKU编码 */
  sku: FieldConfig = {
    name: 'sku',
    label: 'SKU编码',
    type: 'string',
    value: '',
    default: '',
    primary: false,
    visible: true,
    searchable: true,
    readonly: false,
  };
  /** 商品图片 */
  images: FieldConfig = {
    name: 'images',
    label: '商品图片',
    type: 'image-list',
    value: [],
    default: [],
    primary: false,
    visible: false,
    searchable: false,
    readonly: false,
  };
  /** 商品描述 */
  description: FieldConfig = {
    name: 'description',
    label: '商品描述',
    type: 'richtext',
    value: '',
    default: '',
    primary: false,
    visible: false,
    searchable: false,
    readonly: false,
  };
  /** 上架状态 */
  status: FieldConfig = {
    name: 'status',
    label: '上架状态',
    type: 'select',
    value: '0',
    default: '0',
    primary: false,
    visible: true,
    searchable: false,
    readonly: false, options: [{ value: 0, label: '下架' }, { value: 1, label: '上架' }],
  };
  /** 排序 */
  sort: FieldConfig = {
    name: 'sort',
    label: '排序',
    type: 'number',
    value: 0,
    default: 0,
    primary: false,
    visible: false,
    searchable: false,
    readonly: false,
  };
  /** 创建时间 */
  createdAt: FieldConfig = {
    name: 'createdAt',
    label: '创建时间',
    type: 'datetime',
    value: '',
    default: '',
    primary: false,
    visible: true,
    searchable: false,
    readonly: true,
  };

  constructor(data?: Partial<IProduct>) {
    if (data) {
      for (const key in data) {
        const k = key as keyof IProduct;
        if (this[k] && data[k]) {
          this[k].value = data[k]!.value !== undefined ? data[k]!.value : data[k];
        }
      }
    }
  }

  toJSON(): Record<string, any> {
    const result: Record<string, any> = {};
    const keys = Object.keys(this) as (keyof IProduct)[];
    for (const key of keys) {
      if (this[key] && typeof this[key] === 'object' && 'value' in this[key]) {
        result[key] = this[key].value;
      }
    }
    return result;
  }
}

export default ProductModel;