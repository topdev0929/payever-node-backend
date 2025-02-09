import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { TwilioPayloadInterface } from 'src/onboarding/interfaces/incoming';

export class TwilioSetupMessageDto implements TwilioPayloadInterface {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public accountSid: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public authToken: string;
}
