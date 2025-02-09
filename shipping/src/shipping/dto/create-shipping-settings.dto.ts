import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

import { ShippingBoxInterface, ShippingOriginInterface, ShippingZoneInterface } from '../interfaces';
import { ProductDto } from './product.dto';

export class CreateShippingSettingDto {
  @ApiPropertyOptional()
  @IsOptional()
  public isDefault?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  public products: ProductDto[];

  @ApiPropertyOptional()
  @IsOptional()
  public business: string;

  @ApiPropertyOptional()
  @IsOptional()
  public origins?: string[] | ShippingOriginInterface[];

  @ApiPropertyOptional()
  @IsOptional()
  public boxes?: string[] | ShippingBoxInterface[];

  @ApiPropertyOptional()
  @IsOptional()
  public zones?: string[] | ShippingZoneInterface[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public name: string;
}
