import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsObject,
  ValidateNested,
} from 'class-validator';
import {
  Type,
} from 'class-transformer';

import { CheckoutPayloadInterface } from '../../../interfaces/incoming';
import { CheckoutSettingsSetupMessageDto } from './checkout-settings-setup-message.dto';
import { CheckoutSectionsSetupMessageDto } from './checkout-sections-setup-message.dto';

export class CheckoutSetupMessageDto implements CheckoutPayloadInterface {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public logo?: string;

  @ApiProperty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsString({
    each: true,
  })
  public channels: string[];

  @ApiProperty()
  @IsObject()
  @Type(() => CheckoutSettingsSetupMessageDto)
  @ValidateNested()
  public settings?: CheckoutSettingsSetupMessageDto;

  @ApiProperty()
  @IsOptional()
  @Type(() => CheckoutSectionsSetupMessageDto)
  @ValidateNested()
  public sections?: CheckoutSectionsSetupMessageDto;
}
