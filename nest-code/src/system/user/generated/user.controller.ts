/**
 * 用户 Controller（标准接口）
 * 自动生成 - 来源：user.xml
 * ⚠️ 此文件每次重新生成都会被覆盖，请勿在此写业务逻辑
 *    自定义接口逻辑请写在上级目录的 user.controller.ts 中
 */

import { Controller, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
// 注入自定义 Service（位于上级目录），以确保自定义逻辑生效
import { UserService } from '../user.service';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// 导入可复用的参数类型和返回类型
import type { ListQuery, UserFindAllReturn, UserRemoveReturn } from './user.types';

@ApiTags('用户')
@Controller('system/user')
export class UserControllerBase {
  constructor(protected readonly userService: UserService) {}

  @ApiOperation({ summary: '查询列表' })
  @Post('list')
  async findAll(@Body() query: ListQuery): Promise<UserFindAllReturn> {
    return this.userService.findAll(query);
  }

  @ApiOperation({ summary: '查询详情' })
  @Post('detail')
  async findOne(@Body() idQuery: any): Promise<UserEntity> {
    return this.userService.findOne(idQuery);
  }

  @ApiOperation({ summary: '新建' })
  @Post('create')
  async create(@Body() body: Partial<UserEntity>): Promise<UserEntity> {
    return this.userService.create(body);
  }

  @ApiOperation({ summary: '更新' })
  @Post('update')
  async update(@Body() body: Partial<UserEntity>): Promise<UserEntity> {
    return this.userService.update(body);
  }

  @ApiOperation({ summary: '删除' })
  @Post('delete')
  async remove(@Body() idQuery: any): Promise<UserRemoveReturn> {
    return this.userService.remove(idQuery);
  }

  @ApiOperation({ summary: '自定义方法' })
  @Post('customUpdate')
  async customUpdate(@Body() body: Partial<UserEntity>): Promise<UserEntity> {
    return this.userService.customUpdate(body);
  }

}