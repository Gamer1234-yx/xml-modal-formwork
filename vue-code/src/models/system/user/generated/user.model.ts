/**
 * 用户 数据模型
 * 自动生成 - 来源：user.xml
 * ⚠️ 此文件每次重新生成都会被覆盖
 */

import type { FieldConfig } from '@/models/common/types';

export interface IUser {
  /** ID */
  id?: FieldConfig;
  /** 用户名 */
  username: FieldConfig;
  /** 昵称 */
  nickname?: FieldConfig;
  /** 邮箱 */
  email: FieldConfig;
  /** 手机号 */
  phone?: FieldConfig;
  /** 密码 */
  password: FieldConfig;
  /** 性别 */
  gender?: FieldConfig;
  /** 生日 */
  birthday?: FieldConfig;
  /** 状态 */
  status: FieldConfig;
  /** 备注 */
  remark?: FieldConfig;
  /** 创建时间 */
  createdAt?: FieldConfig;
  /** 更新时间 */
  updatedAt?: FieldConfig;
}

export class UserModel implements IUser {
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
  /** 用户名 */
  username: FieldConfig = {
    name: 'username',
    label: '用户名',
    type: 'string',
    value: '',
    default: '',
    primary: false,
    visible: true,
    searchable: true,
    readonly: false,
  };
  /** 昵称 */
  nickname: FieldConfig = {
    name: 'nickname',
    label: '昵称',
    type: 'string',
    value: '',
    default: '',
    primary: false,
    visible: true,
    searchable: false,
    readonly: false,
  };
  /** 邮箱 */
  email: FieldConfig = {
    name: 'email',
    label: '邮箱',
    type: 'email',
    value: '',
    default: '',
    primary: false,
    visible: true,
    searchable: true,
    readonly: false,
  };
  /** 手机号 */
  phone: FieldConfig = {
    name: 'phone',
    label: '手机号',
    type: 'string',
    value: '',
    default: '',
    primary: false,
    visible: true,
    searchable: false,
    readonly: false,
  };
  /** 密码 */
  password: FieldConfig = {
    name: 'password',
    label: '密码',
    type: 'password',
    value: '',
    default: '',
    primary: false,
    visible: false,
    searchable: false,
    readonly: false,
  };
  /** 性别 */
  gender: FieldConfig = {
    name: 'gender',
    label: '性别',
    type: 'select',
    value: '',
    default: '',
    primary: false,
    visible: true,
    searchable: false,
    readonly: false,
    options: [{ value: 0, label: '未知' }, { value: 1, label: '男' }, { value: 2, label: '女' }]
  };
  /** 生日 */
  birthday: FieldConfig = {
    name: 'birthday',
    label: '生日',
    type: 'date',
    value: '',
    default: '',
    primary: false,
    visible: false,
    searchable: false,
    readonly: false,
  };
  /** 状态 */
  status: FieldConfig = {
    name: 'status',
    label: '状态',
    type: 'select',
    value: '1',
    default: '1',
    primary: false,
    visible: true,
    searchable: false,
    readonly: false,
    options: [{ value: 0, label: '禁用' }, { value: 1, label: '正常' }]
  };
  /** 备注 */
  remark: FieldConfig = {
    name: 'remark',
    label: '备注',
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
    readonly: true,
  };
  /** 更新时间 */
  updatedAt: FieldConfig = {
    name: 'updatedAt',
    label: '更新时间',
    type: 'datetime',
    value: '',
    default: '',
    primary: false,
    visible: true,
    searchable: false,
    readonly: true,
  };

  constructor(data?: Partial<IUser>) {
    if (data) {
      for (const key in data) {
        const k = key as keyof IUser;
        if (this[k] && data[k]) {
          this[k].value = data[k]!.value !== undefined ? data[k]!.value : data[k];
        }
      }
    }
  }

  toJSON(): Record<string, any> {
    const result: Record<string, any> = {};
    const keys = Object.keys(this) as (keyof IUser)[];
    for (const key of keys) {
      if (this[key] && typeof this[key] === 'object' && 'value' in this[key]) {
        result[key] = this[key].value;
      }
    }
    return result;
  }
}

export default UserModel;