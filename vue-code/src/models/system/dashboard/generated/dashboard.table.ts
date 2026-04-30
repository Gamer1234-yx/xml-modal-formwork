/**
 * 首页 表格列配置
 * 自动生成 - 来源：dashboard.xml
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

export const dashboardTableColumns: TableColumnConfig[] = [
];

// 搜索字段
export const dashboardSearchFields = [
];

export default { dashboardTableColumns, dashboardSearchFields };