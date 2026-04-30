/**
 * 首页 Service（标准实现）
 * 自动生成 - 来源：dashboard.xml
 * ⚠️ 此文件每次重新生成都会被覆盖，请勿在此写业务逻辑
 *    自定义逻辑请写在上级目录的 dashboard.service.ts 中
 */

import { Injectable } from '@nestjs/common';
// 导入可复用的参数类型和返回类型
import type { DashboardSummary } from './dashboard.types';

@Injectable()
export class DashboardServiceBase {
  /** 获取首页数据 */
  async getDashboard(body: any): Promise<DashboardSummary> {
    // TODO: 实现 getDashboard 方法的业务逻辑
    return void 0 as DashboardSummary
  }
}