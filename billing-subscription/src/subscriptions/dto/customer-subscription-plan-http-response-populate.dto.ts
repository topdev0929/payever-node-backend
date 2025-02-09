import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

import { CustomerPlanDto } from './customer-plan.dto';
import { ConnectionPlanHttpResponseDto } from './connection-plan-http-response.dto';
import { SubscribersGroupHttpResponseDto } from './subscribers-group-http-response.dto';
import {
  PlansGroupHttpResponseDto,
} from './plans-group-http-response.dto';
import { CustomerSubscriptionPlanHttpBaseDto } from './customer-subscription-plan.dto';

export class CustomerSubscriptionPlanHttpResponsePopulatedDto extends CustomerSubscriptionPlanHttpBaseDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public _id?: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => SubscribersGroupHttpResponseDto)
  public subscribersGroups?: SubscribersGroupHttpResponseDto[];

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerPlanDto)
  public customer?: CustomerPlanDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => ConnectionPlanHttpResponseDto)
  public plan?: ConnectionPlanHttpResponseDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested({
    each: true,
  })
  @Type(() => PlansGroupHttpResponseDto)
  public plansGroup?: PlansGroupHttpResponseDto[];
}
