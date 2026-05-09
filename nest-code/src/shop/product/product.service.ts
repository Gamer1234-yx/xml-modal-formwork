import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductServiceBase } from './generated/product.service';
import { ProductEntity } from './generated/product.entity';
import { CreateProductDto } from './generated/dto/create-product.dto';
import { UpdateProductDto } from './generated/dto/update-product.dto';
import { WsEntityHelper } from '../../common/ws/ws-entity.service';
import { WsService } from '../../common/ws';
// 导入可复用的参数类型和返回类型
import type { ListQuery, IdQuery, ProductFindAllReturn, ProductRemoveReturn } from './generated/product.types';

@Injectable()
export class ProductService extends ProductServiceBase implements OnModuleInit {
  protected wsHelper: WsEntityHelper;

  constructor(
    @InjectRepository(ProductEntity)
    protected readonly repo: Repository<ProductEntity>,
    wsService: WsService,
  ) {
    super(repo);
    this.wsHelper = new WsEntityHelper(wsService);
  }

  onModuleInit() {
    this.wsHelper.init(this, 'shop/product');
  }

  /** 查询商品列表 */
  async findAll(query?: Record<string, any>): Promise<ProductFindAllReturn> {
    return super.findAll(query);
  }

  /** 添加商品（通过 WS 实时推送） */
  async create(body: Partial<CreateProductDto>) {
    const record = await super.create(body);
    this.wsHelper.pushData();
    return record;
  }

  /** 更新商品（通过 WS 实时推送） */
  async update(body: Partial<UpdateProductDto>) {
    const record = await super.update(body);
    this.wsHelper.pushData();
    return record;
  }

  /** 删除商品（通知 WS 更新列表） */
  async remove(body: Partial<IdQuery>): Promise<ProductRemoveReturn> {
    const result = await super.remove(body);
    this.wsHelper.pushData();
    return result;
  }
}
