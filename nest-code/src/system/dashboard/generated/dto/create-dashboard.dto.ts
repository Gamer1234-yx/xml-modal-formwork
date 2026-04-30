/**
 * 首页 CreateDTO
 * 自动生成 - 来源：dashboard.xml
 */

import { IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDashboardDto {
  /** 用户总数 */
  @IsOptional()
  @IsNumber()
  userCount?: number;

  /** 商品总数 */
  @IsOptional()
  @IsString()
  productCount?: string;

  /** 模型定义 */
  @IsOptional()
  @IsString()
  modelCount?: string;

  /** 系统模块 */
  @IsOptional()
  @IsString()
  systemModuleCount?: string;

}