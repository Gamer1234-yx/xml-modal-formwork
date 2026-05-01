/**
 * 商品 表格列配置
 * 自动生成 - 来源：product.xml
 */

import type { TableColumnConfig } from '@/models/common/types';

export const ProductTableColumns: TableColumnConfig[] = [
  {
    prop: 'id',
    label: 'ID',
    visible: false,
    sortable: true,
  },
  {
    prop: 'name',
    label: '商品名称',
    visible: true,
    sortable: true,
  },
  {
    prop: 'categoryId',
    label: '分类',
    visible: true,
    sortable: true,
    tag: true,
    options: [{ value: '类别1', label: '类别1' }, { value: '类别2', label: '类别2' }, { value: '类别3', label: '类别3' }],
  },
  {
    prop: 'price',
    label: '价格(元)',
    visible: true,
    sortable: true,
  },
  {
    prop: 'stock',
    label: '库存',
    visible: true,
    sortable: true,
  },
  {
    prop: 'sku',
    label: 'SKU编码',
    visible: true,
    sortable: true,
  },
  {
    prop: 'images',
    label: '商品图片',
    visible: false,
    sortable: true,
  },
  {
    prop: 'status',
    label: '上架状态',
    visible: true,
    sortable: true,
    tag: true,
    options: [{ value: '0', label: '下架' }, { value: '1', label: '上架' }],
  },
  {
    prop: 'description',
    label: '商品描述',
    visible: true,
    sortable: true,
  },
  {
    prop: 'sort',
    label: '排序',
    visible: false,
    sortable: true,
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    visible: true,
    sortable: true,
    formatter: 'datetime',
    minWidth: 160,
  },
];

// 搜索字段
export const ProductSearchFields = [
  { prop: 'name', label: '商品名称', component: 'ElInput' },
  { prop: 'categoryId', label: '分类', component: 'ElSelect' },
  { prop: 'sku', label: 'SKU编码', component: 'ElInput' },
];

export default { ProductTableColumns, ProductSearchFields };