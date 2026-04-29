/**
 * 用户 Module（标准实现）
 * 自动生成 - 来源：user.xml
 * ⚠️ 此文件每次重新生成都会被覆盖
 *    自定义模块配置请修改上级目录的 user.module.ts
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserService } from '../user.service';
import { UserController } from '../user.controller';

export const USER_MODULE_BASE_CONFIG = {
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
};

@Module(USER_MODULE_BASE_CONFIG)
export class UserModuleBase {}