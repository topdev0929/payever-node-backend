import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
} from 'class-validator';
import { AppsPayloadInterface } from '../../../interfaces/incoming';

export class AppsSetupMessageDto implements AppsPayloadInterface {
  @ApiProperty()
  @IsString({
    each: true,
  })
  public install: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  public onboardingName?: string;
}
