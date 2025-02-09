import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { PlanInterface } from '../interfaces';

export class SubscriptionDto {
  @IsString()
  @IsNotEmpty()
  public _id: string;

  @ValidateNested()
  public plan: PlanInterface;
}



