/**
 * 首页 API 服务（标准实现）
 * 自动生成 - 来源：dashboard.xml
 * ⚠️ 此文件每次重新生成都会被覆盖
 *    自定义请求逻辑请写在同目录的 dashboard.api.ts 中
 */

import request from '@/utils/request';
import type { ApiResponse } from '@/utils/request';
import type { IDashboard } from './dashboard.model';
import type { DashboardSummary } from './dashboard.types';

const BASE_URL = '/system/dashboard';

export class DashboardApiBase {
  /** 获取首页数据 */
  getDashboard(params?: Record<string, any>): Promise<ApiResponse<DashboardSummary>> {
    return request.post<ApiResponse<DashboardSummary>>(`${BASE_URL}/dashboard`, params);
  }

}

export default DashboardApiBase;