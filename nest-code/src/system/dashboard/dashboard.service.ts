/**
 * 首页 Service（自定义业务逻辑）
 * 此文件不会被生成器覆盖，请在此处编写自定义查询逻辑
 *
 * 使用方式：
 *   1. 直接重写基类方法（会完全替换基类逻辑）
 *   2. 调用 super.xxx() 复用基类逻辑，再追加自定义处理
 *   3. 新增完全自定义的方法
 *
 * 示例：
 *   async findAll(query?: Record<string, any>) {
 *     // 自定义：追加权限过滤、联表查询等
 *     return super.findAll(query);
 *   }
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardServiceBase } from './generated/dashboard.service';
import type { DashboardSummary } from './generated/dashboard.types';
import { UserEntity } from '../user/generated/user.entity';
import { ProductEntity } from '../../shop/product/generated/product.entity';

@Injectable()
export class DashboardService extends DashboardServiceBase {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {
    super();
  }

  async getDashboard(body: any): Promise<DashboardSummary> {
    // 查询用户总数
    const userCount = await this.userRepo.count();
    
    // 查询商品总数
    const productCount = await this.productRepo.count();

    return {
      userCount,
      productCount,
    };
  }
}