/**
 * 首页 数据模型
 * 自动生成 - 来源：dashboard.xml
 * ⚠️ 此文件每次重新生成都会被覆盖
 */

import type { FieldConfig } from '@/models/common/types';

export interface IDashboard {
  /** 用户总数 */
  userCount?: FieldConfig;
  /** 商品总数 */
  productCount?: FieldConfig;
  /** 模型定义 */
  modelCount?: FieldConfig;
  /** 系统模块 */
  systemModuleCount?: FieldConfig;
}

export class DashboardModel implements IDashboard {
  /** 用户总数 */
  userCount: FieldConfig = {
    name: 'userCount',
    label: '用户总数',
    type: 'number',
    value: 10,
    default: 10,
    primary: false,
    visible: true,
    searchable: false,
    readonly: false,
  };
  /** 商品总数 */
  productCount: FieldConfig = {
    name: 'productCount',
    label: '商品总数',
    type: 'string',
    value: '0',
    default: '0',
    primary: false,
    visible: true,
    searchable: false,
    readonly: false,
  };
  /** 模型定义 */
  modelCount: FieldConfig = {
    name: 'modelCount',
    label: '模型定义',
    type: 'string',
    value: '0',
    default: '0',
    primary: false,
    visible: true,
    searchable: false,
    readonly: false,
  };
  /** 系统模块 */
  systemModuleCount: FieldConfig = {
    name: 'systemModuleCount',
    label: '系统模块',
    type: 'string',
    value: '0',
    default: '0',
    primary: false,
    visible: true,
    searchable: false,
    readonly: false,
  };

  constructor(data?: Partial<IDashboard>) {
    if (data) {
      for (const key in data) {
        const k = key as keyof IDashboard;
        if (this[k] && data[k]) {
          this[k].value = data[k]!.value !== undefined ? data[k]!.value : data[k];
        }
      }
    }
  }

  toJSON(): Record<string, any> {
    const result: Record<string, any> = {};
    const keys = Object.keys(this) as (keyof IDashboard)[];
    for (const key of keys) {
      if (this[key] && typeof this[key] === 'object' && 'value' in this[key]) {
        result[key] = this[key].value;
      }
    }
    return result;
  }
}

export default DashboardModel;