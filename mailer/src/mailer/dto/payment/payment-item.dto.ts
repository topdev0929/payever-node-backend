import { IsString, IsNotEmpty, IsUUID, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ItemOptionDto } from './item-option.dto';
import { Type } from 'class-transformer';

export class PaymentItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public uuid: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public price: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public quantity: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public item_type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public shipping_type: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public thumbnail?: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => ItemOptionDto)
  public options?: ItemOptionDto[];
}
