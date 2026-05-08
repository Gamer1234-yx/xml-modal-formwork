/**
 * 日志 可复用的参数类型和返回类型
 * 自动生成 - 来源：log.xml
 * ⚠️ 此文件每次重新生成都会被覆盖
 */

import type { LogEntity } from './log.entity';

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

export type LogFindAllReturn = { list: LogEntity[]; total: number; page: number; pageSize: number; };
export type LogRemoveReturn = { message: string; };
