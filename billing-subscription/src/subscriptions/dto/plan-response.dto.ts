import { IsString, IsNotEmpty, ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { ConnectionHttpResponseDto } from './connection-response.dto';
import { SubscriptionPlanHttpResponseDto } from './subscription-plan-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PlanHttpResponseDto {
  @IsString()
  @IsNotEmpty()
  public _id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public business: string;

  @ApiProperty({ required: true })
  @ValidateNested()
  @IsDefined()
  @Type(() => ConnectionHttpResponseDto)
  public connection: ConnectionHttpResponseDto;

  @ApiProperty({ required: true })
  @ValidateNested()
  @IsDefined()
  @Type(() => SubscriptionPlanHttpResponseDto)
  public subscriptionPlan: SubscriptionPlanHttpResponseDto;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public products: string[];
}
