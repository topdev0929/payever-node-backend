import { IsString, IsEnum, IsNumber, IsInt, IsDefined } from 'class-validator';
import { PlanTypeEnum, BillingIntervalsEnum } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionPlanHttpResponseDto {
  @IsString()
  public _id: string;

  @ApiProperty({ required: false })
  @IsNumber()
  public billingPeriod: number;

  @ApiProperty({ required: false })
  @IsEnum(BillingIntervalsEnum)
  public interval: BillingIntervalsEnum;

  @ApiProperty({ required: false })
  @IsEnum(PlanTypeEnum)
  public planType: PlanTypeEnum;

  @ApiProperty({ required: false })
  @IsDefined()
  public products: string[];

  @ApiProperty()
  public isDefault?: boolean;

  @IsString()
  public shortName: string;

  @IsInt()
  public price: number;

  @IsString()
  public theme: string;

  @IsInt()
  public subscribersTotals: number;
}
