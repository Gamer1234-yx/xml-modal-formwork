/**
 * 日志 Module（标准实现）
 * 自动生成 - 来源：log.xml
 * ⚠️ 此文件每次重新生成都会被覆盖
 *    自定义模块配置请修改上级目录的 log.module.ts
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './log.entity';
import { LogService } from '../log.service';
import { LogController } from '../log.controller';

export const LOG_MODULE_BASE_CONFIG = {
  imports: [TypeOrmModule.forFeature([LogEntity])],
  controllers: [LogController],
  providers: [LogService],
  exports: [LogService],
};

@Module(LOG_MODULE_BASE_CONFIG)
export class LogModuleBase {}