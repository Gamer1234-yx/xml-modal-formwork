/**
 * 日志 可复用的参数类型和返回类型（Vue 端）
 * 自动生成 - 来源：log.xml
 * ⚠️ 此文件每次重新生成都会被覆盖
 */

import type { ILog } from './log.model';

export interface ListQuery {
  page?: number;
  pageSize?: number;
  level?: string;
  module?: string;
  operator?: string;
  startTime?: any;
  endTime?: any;
}

export interface IdQuery {
  id: number;
}

export type LogFindAllReturn = { list: ILog[]; total: number; page: number; pageSize: number; };
export type LogRemoveReturn = { message: string; };
