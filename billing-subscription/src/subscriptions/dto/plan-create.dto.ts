import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PaymentMethodsEnum, PlanTypeEnum } from '../enums';

export class PlanCreateDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsUUID('4')
  @IsString()
  public businessId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEnum(PlanTypeEnum)
  public type: PlanTypeEnum;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsUUID('4')
  @IsString()
  public product: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEnum(PaymentMethodsEnum)
  public paymentMethod: PaymentMethodsEnum;
}
