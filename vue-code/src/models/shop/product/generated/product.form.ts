/**
 * 商品 表单配置
 * 自动生成 - 来源：product.xml
 */

import type { FormFieldConfig, FormItemRule } from '@/models/common/types';

export const ProductFormFields: FormFieldConfig[] = [
  {
    prop: 'name',
    label: '商品名称',
    component: 'ElInput',
  },
  {
    prop: 'categoryId',
    label: '分类',
    component: 'ElSelect',
    options: [{ value: '类别1', label: '类别1' }, { value: '类别2', label: '类别2' }, { value: '类别3', label: '类别3' }],
  },
  {
    prop: 'price',
    label: '价格(元)',
    component: 'ElInputNumber',
  },
  {
    prop: 'stock',
    label: '库存',
    component: 'ElInputNumber',
  },
  {
    prop: 'sku',
    label: 'SKU编码',
    component: 'ElInput',
  },
  {
    prop: 'status',
    label: '上架状态',
    component: 'ElSelect',
    options: [{ value: '0', label: '下架' }, { value: '1', label: '上架' }],
  },
  {
    prop: 'description',
    label: '商品描述',
    component: 'ElInput',
    componentProps: { type: 'textarea', rows: 4 },
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    component: 'ElDatePicker',
    componentProps: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    readonly: true,
  },
];

// ---- 表单校验规则 ----
export const ProductFormRules: Record<string, FormItemRule[]> = {
  name: [
    { required: true, message: '商品名称2-100字', trigger: ['blur', 'change'] },
    { min: 2, message: '最少2个字符', trigger: 'blur' },
    { max: 100, message: '最多100个字符', trigger: 'blur' },
  ],
  categoryId: [
    { required: true, message: '请选择商品分类', trigger: ['blur', 'change'] },
  ],
  price: [
    { required: true, message: '价格须大于0', trigger: ['blur', 'change'] },
  ],
  stock: [
    { required: true, message: '库存须为非负整数', trigger: ['blur', 'change'] },
  ],
  sku: [
    { max: 64, message: '最多64个字符', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '请输入上架状态', trigger: ['blur', 'change'] },
  ],
  description: [
    { max: 5000, message: '最多5000个字符', trigger: 'blur' },
  ],
};

export default { ProductFormFields, ProductFormRules };