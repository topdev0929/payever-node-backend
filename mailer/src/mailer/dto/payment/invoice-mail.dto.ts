import { Allow, IsArray, IsNotEmpty, IsString, ValidateNested, IsOptional } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { BusinessLocaleDto } from './business-locale.dto';
import { InvoiceDto } from '../invoice';
import { ApiProperty } from '@nestjs/swagger';
import { ServerTypeEnum } from '../../enum';

const TO_ALL_BUSINESS_EMAILS: string = 'all-business-emails';

export class InvoiceMailDto extends BusinessLocaleDto {
  @IsNotEmpty()
  @IsString()
  public to: string;

  @IsArray()
  public cc: string[] = [];

  @IsNotEmpty()
  @IsString()
  public template_name: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => InvoiceDto)
  public invoice: InvoiceDto;

  @Allow()
  @Expose()
  public variables: any;

  public business?: any;

  public bankAccount?: any;

  public toShouldUseBusinessEmail(): boolean {
    return TO_ALL_BUSINESS_EMAILS === this.to;
  }

  public ccShouldUseBusinessEmail(): boolean {
    return Array.isArray(this.cc) && TO_ALL_BUSINESS_EMAILS === this.cc[0];
  }

  @ApiProperty()
  @IsOptional()
  public serverType?: ServerTypeEnum;
}
