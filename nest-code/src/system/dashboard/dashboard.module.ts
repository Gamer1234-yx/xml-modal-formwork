/**
 * 首页 Module（自定义模块配置）
 * 此文件不会被生成器覆盖，请在此处自定义模块注册
 *
 * 使用方式：
 *   1. 在 config 中添加 imports / providers / controllers / exports
 *   2. 导入其他模块
 *   3. 注册自定义 Provider
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DASHBOARD_MODULE_BASE_CONFIG, DashboardModuleBase } from './generated/dashboard.module';
import { UserEntity } from '../user/generated/user.entity';
import { ProductEntity } from '../../shop/product/generated/product.entity';

// 自定义：添加 TypeOrmModule 导入以支持数据查询
const config = {
  ...DASHBOARD_MODULE_BASE_CONFIG,
  imports: [
    ...DASHBOARD_MODULE_BASE_CONFIG.imports,
    TypeOrmModule.forFeature([UserEntity, ProductEntity]),
  ],
};

@Module(config)
export class DashboardModule {}