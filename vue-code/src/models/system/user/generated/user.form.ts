/**
 * 用户 表单配置
 * 自动生成 - 来源：user.xml
 */

import type { FormFieldConfig, FormItemRule } from '@/models/common/types';

export const UserFormFields: FormFieldConfig[] = [
  {
    prop: 'username',
    label: '用户名',
    component: 'ElInput',
  },
  {
    prop: 'nickname',
    label: '昵称',
    component: 'ElInput',
  },
  {
    prop: 'email',
    label: '邮箱',
    component: 'ElInput',
  },
  {
    prop: 'phone',
    label: '手机号',
    component: 'ElInput',
  },
  {
    prop: 'gender',
    label: '性别',
    component: 'ElSelect',
    options: [{ value: '0', label: '未知' }, { value: '1', label: '男' }, { value: '2', label: '女' }],
  },
  {
    prop: 'status',
    label: '状态',
    component: 'ElSelect',
    options: [{ value: '0', label: '禁用' }, { value: '1', label: '正常' }],
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    component: 'ElDatePicker',
    componentProps: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    readonly: true,
  },
  {
    prop: 'updatedAt',
    label: '更新时间',
    component: 'ElDatePicker',
    componentProps: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    readonly: true,
  },
];

// ---- 表单校验规则 ----
export const UserFormRules: Record<string, FormItemRule[]> = {
  username: [
    { required: true, message: '用户名只能包含字母、数字和下划线，长度3-20位', trigger: ['blur', 'change'] },
    { min: 3, message: '最少3个字符', trigger: 'blur' },
    { max: 20, message: '最多20个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线，长度3-20位', trigger: 'blur' },
  ],
  nickname: [
    { max: 50, message: '最多50个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] },
    { type: 'email', message: '请输入有效的邮箱', trigger: 'blur' },
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '密码长度8-32位', trigger: ['blur', 'change'] },
    { min: 8, message: '最少8个字符', trigger: 'blur' },
    { max: 32, message: '最多32个字符', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '请输入状态', trigger: ['blur', 'change'] },
  ],
  remark: [
    { max: 500, message: '最多500个字符', trigger: 'blur' },
  ],
};

export default { UserFormFields, UserFormRules };