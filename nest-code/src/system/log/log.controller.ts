/**
 * 日志 Controller（自定义接口逻辑）
 * 此文件不会被生成器覆盖，请在此处编写自定义接口逻辑
 *
 * 使用方式：
 *   1. 直接重写基类接口方法
 *   2. 新增自定义接口（记得加 @Get/@Post 等装饰器）
 */

import { Controller, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogControllerBase } from './generated/log.controller';
import { CreateLogDto } from './generated/dto/create-log.dto';
import { UpdateLogDto } from './generated/dto/update-log.dto';

@ApiTags('日志')
@Controller('system/log')
export class LogController extends LogControllerBase {
  // 可在此处重写接口逻辑，或新增自定义接口
}