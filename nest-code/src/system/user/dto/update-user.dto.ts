/**
 * 用户 UpdateDTO
 * 自动生成 - 来源：user.xml
 */

import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}