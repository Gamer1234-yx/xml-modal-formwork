/**
 * 日志 实体
 * 自动生成 - 来源：log.xml
 * ⚠️ 此文件每次重新生成都会被覆盖，请勿在此写业务逻辑
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('log')
export class LogEntity {
  /** ID */
  @PrimaryGeneratedColumn()
  id: number;

  /** 日志级别 */
  @Column({ type: 'text' })
  level: string;

  /** 日志消息 */
  @Column({ type: 'text' })
  message: string;

  /** 所属模块 */
  @Column({ type: 'text', nullable: true })
  module: string;

  /** 操作类型 */
  @Column({ type: 'text', nullable: true })
  action: string;

  /** 操作人 */
  @Column({ type: 'text', nullable: true })
  operator: string;

  /** 客户端IP */
  @Column({ type: 'text', nullable: true })
  ip: string;

  /** 请求ID */
  @Column({ type: 'text', nullable: true })
  requestId: string;

  /** 堆栈信息 */
  @Column({ type: 'text', nullable: true })
  stackTrace: string;

  /** 创建时间 */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

}