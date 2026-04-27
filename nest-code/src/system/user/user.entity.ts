/**
 * 用户 实体
 * 自动生成 - 来源：user.xml
 */

import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  /** ID */
  @PrimaryGeneratedColumn()
  id: number;

  /** 用户名 */
  @Column({ type: 'text' })
  username: string;

  /** 昵称 */
  @Column({ type: 'text', nullable: true })
  nickname: string;

  /** 邮箱 */
  @Column({ type: 'text' })
  email: string;

  /** 手机号 */
  @Column({ type: 'text', nullable: true })
  phone: string;

  /** 密码 */
  @Column({ type: 'text' })
  password: string;

  /** 性别 */
  @Column({ type: 'text', nullable: true })
  gender: string;

  /** 生日 */
  @Column({ type: 'text', nullable: true })
  birthday: string;

  /** 头像 */
  @Column({ type: 'text', nullable: true })
  avatar: string;

  /** 状态 */
  @Column({ type: 'text', default: 1 })
  status: string;

  /** 备注 */
  @Column({ type: 'text', nullable: true })
  remark: string;

  /** 创建时间 */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /** 更新时间 */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

}