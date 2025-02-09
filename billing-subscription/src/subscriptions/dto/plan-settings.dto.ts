import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { BillingIntervalsEnum } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

export class PlanSettingsDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public interval: BillingIntervalsEnum;

  @ApiProperty({ required: false })
  @IsNumber()
  public billingPeriod: number;
}
