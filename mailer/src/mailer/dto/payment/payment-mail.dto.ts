import { Allow, IsArray, IsNotEmpty, IsString, ValidateNested, IsOptional } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { BusinessDto } from './business.dto';
import { PaymentDetailDto } from './payment-detail.dto';
import { PaymentItemDto } from './payment-item.dto';
import { PaymentDto } from './payment.dto';
import { BusinessLocaleDto } from './business-locale.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ServerTypeEnum } from '../../enum';
import { EventAttachmentDto } from '../event-attachment.dto';

const TO_ALL_BUSINESS_EMAILS: string = 'all-business-emails';

export class PaymentMailDto extends BusinessLocaleDto {
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
  @Type(() => BusinessDto)
  public business: BusinessDto;

  @Allow()
  @Expose()
  @ValidateNested()
  @Type(() => PaymentDto)
  public payment: PaymentDto;

  @Allow()
  @Expose()
  public payment_details: PaymentDetailDto[];

  @Allow()
  @Expose()
  public payment_items: PaymentItemDto[];

  @Allow()
  @Expose()
  public variables: any;

  @Allow()
  @Expose()
  public merchant: { name: string; email?: string };

  @Allow()
  @Expose()
  @IsOptional()
  public customer: { name?: string; email?: string } = { };

  public toShouldUseBusinessEmail(): boolean {
    return TO_ALL_BUSINESS_EMAILS === this.to;
  }

  public ccShouldUseBusinessEmail(): boolean {
    return Array.isArray(this.cc) && TO_ALL_BUSINESS_EMAILS === this.cc[0];
  }

  @ApiProperty()
  @IsOptional()
  public server_type?: ServerTypeEnum;

  @ApiProperty()
  @IsOptional()
  @Type(() => EventAttachmentDto)
  @ValidateNested({
    each: true,
  })
  public attachments?: EventAttachmentDto[];
}
