/**
 * 日志 数据模型
 * 自动生成 - 来源：log.xml
 * ⚠️ 此文件每次重新生成都会被覆盖
 */

import type { FieldConfig } from '@/models/common/types';

export interface ILog {
  /** ID */
  id?: FieldConfig;
  /** 日志级别 */
  level: FieldConfig;
  /** 日志消息 */
  message: FieldConfig;
  /** 所属模块 */
  module?: FieldConfig;
  /** 操作类型 */
  action?: FieldConfig;
  /** 操作人 */
  operator?: FieldConfig;
  /** 客户端IP */
  ip?: FieldConfig;
  /** 请求ID */
  requestId?: FieldConfig;
  /** 堆栈信息 */
  stackTrace?: FieldConfig;
  /** 创建时间 */
  createdAt?: FieldConfig;
}

export class LogModel implements ILog {
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
  /** 日志级别 */
  level: FieldConfig = {
    name: 'level',
    label: '日志级别',
    type: 'select',
    value: '',
    default: '',
    primary: false,
    visible: true,
    searchable: true,
    readonly: false,
    options: [{ value: 'debug', label: '调试' }, { value: 'info', label: '信息' }, { value: 'warn', label: '警告' }, { value: 'error', label: '错误' }]
  };
  /** 日志消息 */
  message: FieldConfig = {
    name: 'message',
    label: '日志消息',
    type: 'textarea',
    value: '',
    default: '',
    primary: false,
    visible: true,
    searchable: true,
    readonly: false,
  };
  /** 所属模块 */
  module: FieldConfig = {
    name: 'module',
    label: '所属模块',
    type: 'string',
    value: '',
    default: '',
    primary: false,
    visible: true,
    searchable: true,
    readonly: false,
  };
  /** 操作类型 */
  action: FieldConfig = {
    name: 'action',
    label: '操作类型',
    type: 'string',
    value: '',
    default: '',
    primary: false,
    visible: true,
    searchable: true,
    readonly: false,
  };
  /** 操作人 */
  operator: FieldConfig = {
    name: 'operator',
    label: '操作人',
    type: 'string',
    value: '',
    default: '',
    primary: false,
    visible: true,
    searchable: true,
    readonly: false,
  };
  /** 客户端IP */
  ip: FieldConfig = {
    name: 'ip',
    label: '客户端IP',
    type: 'string',
    value: '',
    default: '',
    primary: false,
    visible: true,
    searchable: true,
    readonly: false,
  };
  /** 请求ID */
  requestId: FieldConfig = {
    name: 'requestId',
    label: '请求ID',
    type: 'string',
    value: '',
    default: '',
    primary: false,
    visible: false,
    searchable: false,
    readonly: false,
  };
  /** 堆栈信息 */
  stackTrace: FieldConfig = {
    name: 'stackTrace',
    label: '堆栈信息',
    type: 'textarea',
    value: '',
    default: '',
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
    readonly: false,
  };

  constructor(data?: Partial<ILog>) {
    if (data) {
      for (const key in data) {
        const k = key as keyof ILog;
        if (this[k] && data[k]) {
          this[k].value = data[k]!.value !== undefined ? data[k]!.value : data[k];
        }
      }
    }
  }

  toJSON(): Record<string, any> {
    const result: Record<string, any> = {};
    const keys = Object.keys(this) as (keyof ILog)[];
    for (const key of keys) {
      if (this[key] && typeof this[key] === 'object' && 'value' in this[key]) {
        result[key] = this[key].value;
      }
    }
    return result;
  }
}

export default LogModel;