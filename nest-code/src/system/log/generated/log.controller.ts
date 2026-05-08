/**
 * 日志 Controller（标准接口）
 * 自动生成 - 来源：log.xml
 * ⚠️ 此文件每次重新生成都会被覆盖，请勿在此写业务逻辑
 *    自定义接口逻辑请写在上级目录的 log.controller.ts 中
 */

import { Controller, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
// 注入自定义 Service（位于上级目录），以确保自定义逻辑生效
import { LogService } from '../log.service';
import { LogEntity } from './log.entity';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
// 导入可复用的参数类型和返回类型
import type { ListQuery, IdQuery, LogFindAllReturn, LogRemoveReturn } from './log.types';

@ApiTags('日志')
@Controller('system/log')
export class LogControllerBase {
  constructor(protected readonly logService: LogService) {}

  @ApiOperation({ summary: '查询日志列表' })
  @Post('list')
  async findAll(@Body() query: ListQuery): Promise<LogFindAllReturn> {
    return this.logService.findAll(query);
  }

  @ApiOperation({ summary: '查询日志详情' })
  @Post('detail')
  async findOne(@Body() idQuery: any): Promise<LogEntity> {
    return this.logService.findOne(idQuery);
  }

  @ApiOperation({ summary: '添加日志' })
  @Post('create')
  async create(@Body() body: Partial<LogEntity>): Promise<LogEntity> {
    return this.logService.create(body);
  }

  @ApiOperation({ summary: '删除日志' })
  @Post('delete')
  async remove(@Body() idQuery: any): Promise<LogRemoveReturn> {
    return this.logService.remove(idQuery);
  }

}