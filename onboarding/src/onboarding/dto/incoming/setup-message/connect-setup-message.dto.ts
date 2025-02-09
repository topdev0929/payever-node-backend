import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
} from 'class-validator';

import { ConnectPayloadInterface } from '../../../interfaces/incoming/connect-payload.interface';

export class ConnectSetupMessageDto implements ConnectPayloadInterface {
  @ApiProperty()
  @IsString({
    each: true,
  })
  public install: string[];
}
