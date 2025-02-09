import { SubscriptionPlanDtoNewProps } from '../subscription-plan-new.dto';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class AdminSubscriptionPlanCreateDto extends SubscriptionPlanDtoNewProps {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public businessId: string;
}
