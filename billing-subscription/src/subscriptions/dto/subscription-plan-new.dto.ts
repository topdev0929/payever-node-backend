import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { PlanTypeEnum } from '../enums';
import { SubscriptionPlanDtoBase } from './subscription-plan.dto';

export class SubscriptionPlanDtoNewProps extends SubscriptionPlanDtoBase {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public channelSet: string;

  @ApiProperty()
  @IsString({
    each: true,
  })
  @IsOptional()
  public subscribedChannelSets: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  public shortName?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @IsOptional()
  public totalPrice?: number;

  @ApiProperty()
  @IsEnum(PlanTypeEnum)
  @IsOptional()
  public planType: PlanTypeEnum;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  public subscribersTotals?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public theme: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public business: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public targetFolderId?: string;
}
