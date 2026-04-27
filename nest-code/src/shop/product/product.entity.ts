/**
 * 商品 实体
 * 自动生成 - 来源：product.xml
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('product')
export class ProductEntity {
  /** ID */
  @PrimaryGeneratedColumn()
  id: number;

  /** 商品名称 */
  @Column({ type: 'text' })
  name: string;

  /** 分类 */
  @Column({ type: 'text' })
  categoryId: string;

  /** 价格(元) */
  @Column({ type: 'real' })
  price: number;

  /** 库存 */
  @Column({ type: 'real' })
  stock: number;

  /** SKU编码 */
  @Column({ type: 'text', nullable: true })
  sku: string;

  /** 商品图片 */
  @Column({ type: 'text', nullable: true })
  images: string;

  /** 商品描述 */
  @Column({ type: 'text', nullable: true })
  description: string;

  /** 上架状态 */
  @Column({ type: 'text', default: 0 })
  status: string;

  /** 排序 */
  @Column({ type: 'real', nullable: true, default: 0 })
  sort: number;

  /** 创建时间 */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

}