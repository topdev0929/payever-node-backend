import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

import { DevicePaymentsPayloadInterface } from '../../../interfaces/incoming';

export class DevicePaymentsMessageDto implements DevicePaymentsPayloadInterface {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  public secondFactor: boolean = false;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  public autoresponderEnabled: boolean = true;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public verificationType: number = 0;
}
