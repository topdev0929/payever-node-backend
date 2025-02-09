import { Allow, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

import { BusinessLocaleDto } from './payment/business-locale.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ServerTypeEnum } from '../enum';

export class BusinessMailDto extends BusinessLocaleDto {
  @IsString()
  @IsOptional()
  public to?: string;

  @IsString()
  @IsOptional()
  public bcc?: string[];

  @IsString()
  @IsOptional()
  public subject?: string;

  @IsString()
  @IsNotEmpty()
  public templateName: string;

  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @Allow()
  @Expose()
  public variables: any;

  @ApiProperty()
  @IsOptional()
  public serverType?: ServerTypeEnum;
}
