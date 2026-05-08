/**
 * 日志 表格列配置
 * 自动生成 - 来源：log.xml
 */

import type { TableColumnConfig } from '@/models/common/types';

export const LogTableColumns: TableColumnConfig[] = [
  {
    prop: 'id',
    label: 'ID',
    visible: false,
    sortable: true,
  },
  {
    prop: 'level',
    label: '日志级别',
    visible: true,
    sortable: true,
    tag: true,
    options: [{ value: 'debug', label: '调试' }, { value: 'info', label: '信息' }, { value: 'warn', label: '警告' }, { value: 'error', label: '错误' }],
  },
  {
    prop: 'message',
    label: '日志消息',
    visible: true,
    sortable: true,
  },
  {
    prop: 'module',
    label: '所属模块',
    visible: true,
    sortable: true,
  },
  {
    prop: 'action',
    label: '操作类型',
    visible: true,
    sortable: true,
  },
  {
    prop: 'operator',
    label: '操作人',
    visible: true,
    sortable: true,
  },
  {
    prop: 'ip',
    label: '客户端IP',
    visible: true,
    sortable: true,
  },
  {
    prop: 'requestId',
    label: '请求ID',
    visible: false,
    sortable: true,
  },
  {
    prop: 'stackTrace',
    label: '堆栈信息',
    visible: false,
    sortable: true,
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    visible: true,
    sortable: true,
    formatter: 'datetime',
    minWidth: 160,
  },
];

// 搜索字段
export const LogSearchFields = [
  { prop: 'level', label: '日志级别', component: 'ElSelect', options: [{ value: 'debug', label: '调试' }, { value: 'info', label: '信息' }, { value: 'warn', label: '警告' }, { value: 'error', label: '错误' }] },
  { prop: 'message', label: '日志消息', component: 'ElInput' },
  { prop: 'module', label: '所属模块', component: 'ElInput' },
  { prop: 'action', label: '操作类型', component: 'ElInput' },
  { prop: 'operator', label: '操作人', component: 'ElInput' },
  { prop: 'ip', label: '客户端IP', component: 'ElInput' },
];

export default { LogTableColumns, LogSearchFields };