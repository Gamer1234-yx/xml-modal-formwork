/**
 * 商品 CreateDTO
 * 自动生成 - 来源：product.xml
 */

import { IsOptional, IsNotEmpty, IsString, MinLength, MaxLength, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  /** 商品名称 */
  @IsNotEmpty({ message: '商品名称2-100字' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  /** 分类 */
  @IsNotEmpty({ message: '请选择商品分类' })
  categoryId: string;

  /** 价格(元) */
  @IsNotEmpty({ message: '价格须大于0' })
  @IsNumber()
  @Min(0)
  @Max(9999999)
  price: number;

  /** 库存 */
  @IsNotEmpty({ message: '库存须为非负整数' })
  @IsNumber()
  @Min(0)
  stock: number;

  /** SKU编码 */
  @IsOptional()
  @IsString()
  @MaxLength(64)
  sku?: string;

  /** 商品图片 */
  @IsOptional()
  images?: string;

  /** 上架状态 */
  @IsNotEmpty({ message: '上架状态不能为空' })
  status: string;

  /** 商品描述 */
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  /** 排序 */
  @IsOptional()
  @IsNumber()
  @Min(0)
  sort?: number;

}