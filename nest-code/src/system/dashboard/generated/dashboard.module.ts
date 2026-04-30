/**
 * 首页 Module（标准实现）
 * 自动生成 - 来源：dashboard.xml
 * ⚠️ 此文件每次重新生成都会被覆盖
 *    自定义模块配置请修改上级目录的 dashboard.module.ts
 */

import { Module } from '@nestjs/common';
import { DashboardService } from '../dashboard.service';
import { DashboardController } from '../dashboard.controller';

export const DASHBOARD_MODULE_BASE_CONFIG = {
  imports: [],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
};

@Module(DASHBOARD_MODULE_BASE_CONFIG)
export class DashboardModuleBase {}