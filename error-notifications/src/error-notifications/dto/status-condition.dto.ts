import { StatusConditionInterface } from '../interfaces';
import { PaymentStatusesEnum, SendingMethodEnum } from '../enums';
import { IsInt, Min, Max, IsEnum, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class StatusConditionDto implements StatusConditionInterface {
  @ApiProperty()
  @Expose()
  @IsEnum(PaymentStatusesEnum, { groups: [SendingMethodEnum.sendByAfterInterval]})
  @IsDefined({ groups: [SendingMethodEnum.sendByAfterInterval]})
  public status: PaymentStatusesEnum;

  @ApiProperty()
  @Expose()
  @IsInt({ groups: [SendingMethodEnum.sendByAfterInterval]})
  @Min(1, { groups: [SendingMethodEnum.sendByAfterInterval]})
  @Max(100, { groups: [SendingMethodEnum.sendByAfterInterval]})
  public percent: number;

  @ApiProperty()
  @Expose()
  @IsInt({ groups: [SendingMethodEnum.sendByAfterInterval]})
  @Min(1, { groups: [SendingMethodEnum.sendByAfterInterval]})
  public value: number;
}
