import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  Validate,
} from 'class-validator';

import { SantanderPayloadInterface } from '../../../interfaces/incoming';
import {
  StringNotContainChars,
  URL_BLACKLIST_SYMBOLS,
} from '../../../validators';

export class SantanderSetupMessageDto implements SantanderPayloadInterface {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Validate(StringNotContainChars, [URL_BLACKLIST_SYMBOLS])
  public connectionName?: string;

  @ApiProperty()
  @IsString()
  @Validate(StringNotContainChars, [URL_BLACKLIST_SYMBOLS])
  public sender: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(StringNotContainChars, [URL_BLACKLIST_SYMBOLS])
  public login: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(StringNotContainChars, [URL_BLACKLIST_SYMBOLS])
  public password: string;

  @ApiProperty()
  @IsString()
  @Validate(StringNotContainChars, [URL_BLACKLIST_SYMBOLS])
  public channel: string;
}
