/**
 * 日志 Module（自定义模块配置）
 * 此文件不会被生成器覆盖，请在此处自定义模块注册
 *
 * 使用方式：
 *   1. 在 config 中添加 imports / providers / controllers / exports
 *   2. 导入其他模块
 *   3. 注册自定义 Provider
 */

import { Module } from '@nestjs/common';
import { LOG_MODULE_BASE_CONFIG, LogModuleBase } from './generated/log.module';
import { WsModule } from '../../common/ws';

// 自定义：可在此处添加更多 imports / providers
const config = {
  ...LOG_MODULE_BASE_CONFIG,
  imports: [...(LOG_MODULE_BASE_CONFIG.imports || []), WsModule],
};

@Module(config)
export class LogModule {}