/**
 * 日志 表单配置
 * 自动生成 - 来源：log.xml
 */

import type { FormFieldConfig, FormItemRule } from '@/models/common/types';

export const LogFormFields: FormFieldConfig[] = [
  {
    prop: 'level',
    label: '日志级别',
    component: 'ElSelect',
    options: [{ value: 'debug', label: '调试' }, { value: 'info', label: '信息' }, { value: 'warn', label: '警告' }, { value: 'error', label: '错误' }],
  },
  {
    prop: 'message',
    label: '日志消息',
    component: 'ElInput',
    componentProps: { type: 'textarea', rows: 4 },
  },
  {
    prop: 'module',
    label: '所属模块',
    component: 'ElInput',
  },
  {
    prop: 'action',
    label: '操作类型',
    component: 'ElInput',
  },
  {
    prop: 'operator',
    label: '操作人',
    component: 'ElInput',
  },
  {
    prop: 'ip',
    label: '客户端IP',
    component: 'ElInput',
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    component: 'ElDatePicker',
    componentProps: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
  },
];

// ---- 表单校验规则 ----
export const LogFormRules: Record<string, FormItemRule[]> = {
  level: [
    { required: true, message: '请输入日志级别', trigger: ['blur', 'change'] },
  ],
  message: [
    { required: true, message: '请输入日志消息', trigger: ['blur', 'change'] },
    { max: 2000, message: '最多2000个字符', trigger: 'blur' },
  ],
  module: [
    { max: 100, message: '最多100个字符', trigger: 'blur' },
  ],
  action: [
    { max: 100, message: '最多100个字符', trigger: 'blur' },
  ],
  operator: [
    { max: 50, message: '最多50个字符', trigger: 'blur' },
  ],
  ip: [
    { max: 50, message: '最多50个字符', trigger: 'blur' },
  ],
  requestId: [
    { max: 64, message: '最多64个字符', trigger: 'blur' },
  ],
  stackTrace: [
    { max: 5000, message: '最多5000个字符', trigger: 'blur' },
  ],
};

export default { LogFormFields, LogFormRules };