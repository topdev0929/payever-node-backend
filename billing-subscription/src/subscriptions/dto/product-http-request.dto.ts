import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsOptional,
  ValidateNested,
  IsEnum,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BillingIntervalsEnum } from '../enums';
import { BusinessHttpRequestDto } from './business-http-request.dto';
import { ProductBaseDto } from './product.dto';

export class ProductHttpRequestDto extends ProductBaseDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsUUID('4')
  public businessUuid: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessHttpRequestDto)
  public business: BusinessHttpRequestDto;

  @ApiProperty()
  @IsOptional()
  @IsEnum(BillingIntervalsEnum)
  public interval: BillingIntervalsEnum;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  public billingPeriod: number;

}
