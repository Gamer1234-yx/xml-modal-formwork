/**
 * 用户 CreateDTO
 * 自动生成 - 来源：user.xml
 */

import { IsOptional, IsNotEmpty, IsString, MinLength, MaxLength, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  /** 用户名 */
  @IsNotEmpty({ message: '用户名只能包含字母、数字和下划线，长度3-20位' })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  /** 昵称 */
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nickname?: string;

  /** 邮箱 */
  @IsNotEmpty({ message: '请输入有效的邮箱地址' })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email: string;

  /** 手机号 */
  @IsOptional()
  @IsString()
  phone?: string;

  /** 密码 */
  @IsNotEmpty({ message: '密码长度8-32位' })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  /** 性别 */
  @IsOptional()
  gender?: string;

  /** 生日 */
  @IsOptional()
  birthday?: string;

  /** 头像 */
  @IsOptional()
  avatar?: string;

  /** 状态 */
  @IsNotEmpty({ message: '状态不能为空' })
  status: string;

  /** 备注 */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;

}