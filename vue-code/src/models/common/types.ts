/**
 * 公共类型定义
 * 自动生成 - 由代码生成器统一管理
 * ⚠️ 此文件每次重新生成都会被覆盖
 */

// 表格列配置
export interface TableColumnConfig {
  prop: string;
  label: string;
  visible: boolean;
  sortable?: boolean;
  width?: number | string;
  minWidth?: number | string;
  formatter?: string;
  tag?: boolean;
  options?: { value: string | number; label: string; type?: string }[];
}

// 表单字段配置
export interface FormFieldConfig {
  prop: string;
  label: string;
  component: string;
  type?: string;
  readonly?: boolean;
  visible?: boolean;
  span?: number;
  options?: { value: string | number; label: string }[];
  componentProps?: Record<string, any>;
}

// 表单校验规则
export interface FormItemRule {
  required?: boolean;
  message?: string;
  trigger?: string | string[];
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validator?: (rule: any, value: any) => Promise<void> | void;
  type?: string;
}

// 字段配置（用于数据模型）
export interface FieldConfig {
  name: string;
  label: string;
  type: string;
  value: any;
  default: any;
  primary: boolean;
  visible: boolean;
  searchable: boolean;
  readonly: boolean;
  options?: { value: string | number; label: string }[];
  conditions?: { name: string; value: string; operator?: string; logic?: 'and' | 'or' }[];
}

// CrudTable query 事件参数类型
export interface QueryParams {
  pageInfo: {
    page: number;
    pageSize: number;
    total: number;
  };
  searchParams: Record<string, any>;
}
