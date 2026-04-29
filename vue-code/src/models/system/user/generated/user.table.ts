/**
 * 用户 表格列配置
 * 自动生成 - 来源：user.xml
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

export const UserTableColumns: TableColumnConfig[] = [
  {
    prop: 'username',
    label: '用户名',
    sortable: true,
  },
  {
    prop: 'nickname',
    label: '昵称',
    sortable: true,
  },
  {
    prop: 'email',
    label: '邮箱',
    sortable: true,
  },
  {
    prop: 'phone',
    label: '手机号',
    sortable: true,
  },
  {
    prop: 'gender',
    label: '性别',
    sortable: true,
    tag: true,
    options: [{ value: '0', label: '未知' }, { value: '1', label: '男' }, { value: '2', label: '女' }],
  },
  {
    prop: 'status',
    label: '状态',
    sortable: true,
    tag: true,
    options: [{ value: '0', label: '禁用' }, { value: '1', label: '正常' }],
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    sortable: true,
    formatter: 'datetime',
    minWidth: 160,
  },
  {
    prop: 'updatedAt',
    label: '更新时间',
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