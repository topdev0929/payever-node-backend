import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
} from 'class-validator';
import { SubscribersGroupInterface } from '../interfaces/entities';
import { CustomerSubscriptionPlanHttpBaseDto } from './customer-subscription-plan.dto';
import { CustomerPlanModel } from '../models/customer-plan.model';
import { ConnectionPlanModel, SubscriptionPlansGroupModel } from '../models';

export class CustomerSubscriptionPlanHttpResponseDto extends CustomerSubscriptionPlanHttpBaseDto {
  @ApiProperty()
  @IsString()
  public _id?: string;

  @ApiProperty()
  @IsString({
    each: true,
  })
  public subscribersGroups?: string[] | SubscribersGroupInterface[];

  @ApiProperty()
  @IsString()
  public customer?: string | CustomerPlanModel;

  @ApiProperty()
  @IsString()
  public plan?: string | ConnectionPlanModel;

  @ApiProperty()
  @IsString({
    each: true,
  })
  public plansGroup?: string[] | SubscriptionPlansGroupModel[];
}
