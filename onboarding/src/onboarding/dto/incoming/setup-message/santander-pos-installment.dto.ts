import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  Validate,
  IsArray,
} from 'class-validator';

import { SantanderPosInstallmentInterface } from '../../../interfaces/incoming';
import {
  StringNotContainChars,
  URL_BLACKLIST_SYMBOLS,
} from '../../../validators';

export class SantanderPosInstallmentDto implements SantanderPosInstallmentInterface {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Validate(StringNotContainChars, [URL_BLACKLIST_SYMBOLS])
  public connectionName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public vendorNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(StringNotContainChars, [URL_BLACKLIST_SYMBOLS])
  public password: string;

  @ApiProperty()
  @IsArray()
  public connections: string[];
}
