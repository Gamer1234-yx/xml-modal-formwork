/**
 * 商品 表格列配置
 * 自动生成 - 来源：product.xml
 */

export interface TableColumnConfig {
  prop: string;
  label: string;
  sortable?: boolean;
  width?: number | string;
  minWidth?: number | string;
  formatter?: string;
  tag?: boolean;
  options?: { value: string | number; label: string; type?: string }[];
}

export const ProductTableColumns: TableColumnConfig[] = [
  {
    prop: 'name',
    label: '商品名称',
    sortable: true,
  },
  {
    prop: 'categoryId',
    label: '分类',
    sortable: true,
  },
  {
    prop: 'price',
    label: '价格(元)',
    sortable: true,
  },
  {
    prop: 'stock',
    label: '库存',
    sortable: true,
  },
  {
    prop: 'sku',
    label: 'SKU编码',
    sortable: true,
  },
  {
    prop: 'status',
    label: '上架状态',
    sortable: true,
    tag: true,
    options: [{ value: 0, label: '下架' }, { value: 1, label: '上架' }],
  },
  {
    prop: 'createdAt',
    label: '创建时间',
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