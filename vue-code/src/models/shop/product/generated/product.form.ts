/**
 * 商品 表单配置
 * 自动生成 - 来源：product.xml
 */

import type { FormItemRule } from 'element-plus';

export interface FormFieldConfig {
  prop: string;
  label: string;
  component: string;
  type?: string;
  readonly?: boolean;
  hidden?: boolean;
  options?: { value: string | number; label: string }[];
  remoteOptions?: { api: string; labelKey: string; valueKey: string };
  componentProps?: Record<string, any>;
}

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
    remoteOptions: { api: '/api/shop/category', labelKey: 'name', valueKey: 'id' },
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
    prop: 'images',
    label: '商品图片',
    component: 'ImageListUpload',
  },
  {
    prop: 'description',
    label: '商品描述',
    component: 'RichTextEditor',
  },
  {
    prop: 'status',
    label: '上架状态',
    component: 'ElSelect',
    options: [{ value: '0', label: '下架' }, { value: '1', label: '上架' }],
  },
  {
    prop: 'sort',
    label: '排序',
    component: 'ElInputNumber',
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
  description: [
    { max: 5000, message: '最多5000个字符', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '请输入上架状态', trigger: ['blur', 'change'] },
  ],
};

export default { ProductFormFields, ProductFormRules };