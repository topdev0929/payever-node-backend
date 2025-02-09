import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { FlowCartItemInterface } from '../../interfaces';
import { ApiCallCartItemAttributesInterface } from '../../../common/interfaces';

export class FlowCartItemRequestDto implements FlowCartItemInterface {
  @IsOptional()
  public extraData?: { } = { };

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public productId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public identifier?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public image?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public name?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  public originalPrice?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  public price: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  public priceNet?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  public quantity: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public sku?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  public vat?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public brand?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  public totalAmount?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  public totalTaxAmount?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public imageUrl?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public productUrl?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Type(() => String)
  public category?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public attributes?: ApiCallCartItemAttributesInterface;
}
