
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsString } from 'class-validator';
import { PaymentMethodsEnum } from '../enums';

export class ConnectionPlanHttpBasetDto {
  @ApiProperty()
  @IsString()
  public business: string;

  @ApiProperty()
  @IsString()
  public connection: string;
  
  @ApiProperty()
  @IsString()
  public subscriptionPlan: string;

  @ApiProperty()
  @IsDefined()
  @IsEnum(PaymentMethodsEnum)
  public paymentMethod: PaymentMethodsEnum;
}
