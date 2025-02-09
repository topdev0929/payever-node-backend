/* eslint-disable max-classes-per-file */
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString, IsUUID, ValidateNested } from 'class-validator';

export enum CheckoutPaymentStatusEnum {
  PAYMENT_ACCEPTED = 'STATUS_ACCEPTED',
}

export class CheckoutBusinessDto {
  @IsUUID('4')
  public uuid: string;
}

export class CheckoutItemDto {
  @IsString()
  public id: string;

  @IsString()
  public product_uuid: string;

  @IsNumber()
  public quantity: number;
}

export class CheckoutPaymentDto {
  @IsEnum(CheckoutPaymentStatusEnum)
  public status: CheckoutPaymentStatusEnum;

  @Type(() => CheckoutBusinessDto)
  public business: CheckoutBusinessDto;

  @ValidateNested({ each: true})
  public items: CheckoutItemDto[];
}

export class CheckoutMessageDto {
  @Type(() => CheckoutPaymentDto)
  public payment: CheckoutPaymentDto;
}
