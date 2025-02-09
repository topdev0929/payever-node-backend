import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { SubscriptionPlanInterface, SubscriptionPlansGroupInterface } from '../interfaces/entities';

export class PlansGroupHttpBodyDto implements SubscriptionPlansGroupInterface {
  @ApiProperty()
  @IsString({
    each: true,
  })
  public plans: SubscriptionPlanInterface[] | string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;
}
