import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsNumber,
  ValidateIf,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

import { AppliedToEnum, BillingIntervalsEnum, SubscriberEligibilityEnum } from '../enums';
import { ApiProperty } from '@nestjs/swagger';
import { ProductBaseDto } from './product.dto';
import { CustomerPlanDto } from './customer-plan.dto';
import { CategoryDto } from './category.dto';
import { SubscribersGroupHttpResponseDto } from './subscribers-group-http-response.dto';

export class SubscriptionPlanDtoBase {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsEnum(BillingIntervalsEnum)
  @IsOptional()
  public interval: BillingIntervalsEnum;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public billingPeriod: number;

  @ApiProperty()
  public isDefault?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public subscriptionNetwork: string;

  @ApiProperty({
    enum: AppliedToEnum,
  })
  @IsEnum(AppliedToEnum)
  @IsOptional()
  public appliesTo: AppliedToEnum;

  @ApiProperty()
  @ValidateIf((self: SubscriptionPlanDtoBase) => self.appliesTo === AppliedToEnum.SPECIFIC_CATEGORIES)
  @ValidateNested({
    each: true,
  })
  @IsNotEmpty()
  @Type(() => CategoryDto)
  @ArrayMinSize(1)
  public categories: CategoryDto[];

  @ApiProperty()
  @ValidateIf((self: SubscriptionPlanDtoBase) => self.appliesTo === AppliedToEnum.SPECIFIC_PRODUCTS)
  @ValidateNested({
    each: true,
  })
  @IsNotEmpty()
  @Type(() => ProductBaseDto)
  @ArrayMinSize(1)
  public products: ProductBaseDto[];

  @ApiProperty({
    enum: SubscriberEligibilityEnum,
  })
  @IsOptional()
  @IsEnum(SubscriberEligibilityEnum)
  public subscribersEligibility: SubscriberEligibilityEnum;

  @ApiProperty({
    type: [SubscribersGroupHttpResponseDto],
  })
  @ValidateIf(
    (self: SubscriptionPlanDtoBase) =>
      self.subscribersEligibility === SubscriberEligibilityEnum.SPECIFIC_GROUPS_OF_SUBSCRIBERS,
  )
  @ValidateNested({
    each: true,
  })
  @IsNotEmpty()
  @Type(() => SubscribersGroupHttpResponseDto)
  @ArrayMinSize(1)
  public subscribersGroups: SubscribersGroupHttpResponseDto[];

  @ApiProperty({
    type: [CustomerPlanDto],
  })
  @ValidateIf(
    (self: SubscriptionPlanDtoBase) =>
      self.subscribersEligibility === SubscriberEligibilityEnum.SPECIFIC_SUBSCRIBERS,
  )
  @ValidateNested({
    each: true,
  })
  @IsNotEmpty()
  @Type(() => CustomerPlanDto)
  @ArrayMinSize(1)
  public subscribers: CustomerPlanDto[];
}
