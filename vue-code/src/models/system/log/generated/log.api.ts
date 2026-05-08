/**
 * 日志 API 服务（标准实现）
 * 自动生成 - 来源：log.xml
 * ⚠️ 此文件每次重新生成都会被覆盖
 *    自定义请求逻辑请写在同目录的 log.api.ts 中
 */

import request from '@/utils/request';
import type { ApiResponse } from '@/utils/request';
import type { ILog } from './log.model';
import type { ListQuery, IdQuery, LogFindAllReturn, LogRemoveReturn } from './log.types';

const BASE_URL = '/system/log';

export class LogApiBase {
  /** 查询日志列表 */
  findAll(query: ListQuery): Promise<ApiResponse<LogFindAllReturn>> {
    return request.post<ApiResponse<LogFindAllReturn>>(`${BASE_URL}/list`, query);
  }

  /** 查询日志详情 */
  findOne(idQuery: any): Promise<ApiResponse<ILog>> {
    return request.post<ApiResponse<ILog>>(`${BASE_URL}/detail`, idQuery);
  }

  /** 添加日志 */
  create(body: Partial<ILog>): Promise<ApiResponse<ILog>> {
    return request.post<ApiResponse<ILog>>(`${BASE_URL}/create`, body);
  }

  /** 删除日志 */
  remove(idQuery: any): Promise<ApiResponse<LogRemoveReturn>> {
    return request.post<ApiResponse<LogRemoveReturn>>(`${BASE_URL}/delete`, idQuery);
  }

}

export default LogApiBase;