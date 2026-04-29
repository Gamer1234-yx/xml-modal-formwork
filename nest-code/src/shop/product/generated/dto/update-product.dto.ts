/**
 * 商品 UpdateDTO
 * 自动生成 - 来源：product.xml
 */

import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}