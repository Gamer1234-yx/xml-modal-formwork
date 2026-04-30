/**
 * 首页 Controller（标准接口）
 * 自动生成 - 来源：dashboard.xml
 * ⚠️ 此文件每次重新生成都会被覆盖，请勿在此写业务逻辑
 *    自定义接口逻辑请写在上级目录的 dashboard.controller.ts 中
 */

import { Controller, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
// 注入自定义 Service（位于上级目录），以确保自定义逻辑生效
import { DashboardService } from '../dashboard.service';
// 导入可复用的参数类型和返回类型
import type { DashboardSummary } from './dashboard.types';

@ApiTags('首页')
@Controller('system/dashboard')
export class DashboardControllerBase {
  constructor(protected readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: '获取首页数据' })
  @Post('dashboard')
  async getDashboard(@Body() body: any): Promise<DashboardSummary> {
    return this.dashboardService.getDashboard(body);
  }

}