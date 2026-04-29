/**
 * 用户 可复用的参数类型和返回类型（Vue 端）
 * 自动生成 - 来源：user.xml
 * ⚠️ 此文件每次重新生成都会被覆盖
 */

import type { IUser } from './user.model';

export interface ListQuery {
  page?: number;
  pageSize?: number;
  username?: string;
  email?: string;
}

export interface DetailQuery {
  id: number;
}

export interface DeleteQuery {
  id: number;
}

export type UserListReturn = { list: IUser[]; total: number; page: number; pageSize: number; };
export type UserDeleteReturn = { message: string; };
