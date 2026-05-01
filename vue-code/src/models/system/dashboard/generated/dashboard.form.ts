/**
 * 首页 表单配置
 * 自动生成 - 来源：dashboard.xml
 */

import type { FormFieldConfig, FormItemRule } from '@/models/common/types';

export const dashboardFormFields: FormFieldConfig[] = [
  {
    prop: 'userCount',
    label: '用户总数',
    component: 'ElInputNumber',
  },
  {
    prop: 'productCount',
    label: '商品总数',
    component: 'ElInput',
  },
  {
    prop: 'modelCount',
    label: '模型定义',
    component: 'ElInput',
  },
  {
    prop: 'systemModuleCount',
    label: '系统模块',
    component: 'ElInput',
  },
];

// ---- 表单校验规则 ----
export const dashboardFormRules: Record<string, FormItemRule[]> = {
};

export default { dashboardFormFields, dashboardFormRules };