/**
 * 用户 表格列配置
 * 自动生成 - 来源：user.xml
 */

import type { TableColumnConfig } from '@/models/common/types';

export const UserTableColumns: TableColumnConfig[] = [
  {
    prop: 'id',
    label: 'ID',
    visible: false,
    sortable: true,
  },
  {
    prop: 'username',
    label: '用户名',
    visible: true,
    sortable: true,
  },
  {
    prop: 'nickname',
    label: '昵称',
    visible: true,
    sortable: true,
  },
  {
    prop: 'email',
    label: '邮箱',
    visible: true,
    sortable: true,
  },
  {
    prop: 'phone',
    label: '手机号',
    visible: true,
    sortable: true,
  },
  {
    prop: 'password',
    label: '密码',
    visible: false,
    sortable: true,
  },
  {
    prop: 'gender',
    label: '性别',
    visible: true,
    sortable: true,
    tag: true,
    options: [{ value: '0', label: '未知' }, { value: '1', label: '男' }, { value: '2', label: '女' }],
  },
  {
    prop: 'birthday',
    label: '生日',
    visible: false,
    sortable: true,
    formatter: 'date',
    minWidth: 160,
  },
  {
    prop: 'status',
    label: '状态',
    visible: true,
    sortable: true,
    tag: true,
    options: [{ value: '0', label: '禁用' }, { value: '1', label: '正常' }],
  },
  {
    prop: 'remark',
    label: '备注',
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
  {
    prop: 'updatedAt',
    label: '更新时间',
    visible: true,
    sortable: true,
    formatter: 'datetime',
    minWidth: 160,
  },
];

// 搜索字段
export const UserSearchFields = [
  { prop: 'username', label: '用户名', component: 'ElInput' },
  { prop: 'email', label: '邮箱', component: 'ElInput' },
];

export default { UserTableColumns, UserSearchFields };