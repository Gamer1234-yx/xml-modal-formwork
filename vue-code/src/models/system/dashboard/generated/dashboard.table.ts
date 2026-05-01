/**
 * 首页 表格列配置
 * 自动生成 - 来源：dashboard.xml
 */

import type { TableColumnConfig } from '@/models/common/types';

export const dashboardTableColumns: TableColumnConfig[] = [
  {
    prop: 'userCount',
    label: '用户总数',
    visible: true,
  },
  {
    prop: 'productCount',
    label: '商品总数',
    visible: true,
  },
  {
    prop: 'modelCount',
    label: '模型定义',
    visible: true,
  },
  {
    prop: 'systemModuleCount',
    label: '系统模块',
    visible: true,
  },
];

// 搜索字段
export const dashboardSearchFields = [
];

export default { dashboardTableColumns, dashboardSearchFields };