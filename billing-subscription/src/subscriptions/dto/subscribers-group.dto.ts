
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CustomerPlanInterface, SubscribersGroupInterface } from '../interfaces/entities';

export class SubscribersGroupBaseDto implements SubscribersGroupInterface {
  @ApiProperty()
  @IsString({
    each: true,
  })
  public subscribers: CustomerPlanInterface[] | string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;
}
