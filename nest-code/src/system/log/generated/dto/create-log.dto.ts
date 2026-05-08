/**
 * 日志 CreateDTO
 * 自动生成 - 来源：log.xml
 */

import { IsOptional, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLogDto {
  /** 日志级别 */
  @IsNotEmpty({ message: '日志级别不能为空' })
  level: string;

  /** 日志消息 */
  @IsNotEmpty({ message: '日志消息不能为空' })
  @IsString()
  @MaxLength(2000)
  message: string;

  /** 所属模块 */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  module?: string;

  /** 操作类型 */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  action?: string;

  /** 操作人 */
  @IsOptional()
  @IsString()
  @MaxLength(50)
  operator?: string;

  /** 客户端IP */
  @IsOptional()
  @IsString()
  @MaxLength(50)
  ip?: string;

  /** 请求ID */
  @IsOptional()
  @IsString()
  @MaxLength(64)
  requestId?: string;

  /** 堆栈信息 */
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  stackTrace?: string;

}