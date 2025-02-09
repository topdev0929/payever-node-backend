import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { CustomerSubscriptionPlanInterface } from '../interfaces/entities';

export class CustomerSubscriptionPlanHttpBaseDto implements CustomerSubscriptionPlanInterface {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public transactionId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public reference: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  public quantity?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public remoteSubscriptionId?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  public trialEnd?: string;
}
