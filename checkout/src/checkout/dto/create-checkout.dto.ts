import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CheckoutSectionInterface } from '../interfaces';
import { CreateChannelSettingsDto } from './create-channel-settings.dto';
import { CreateCheckoutSettingsDto } from './create-checkout-settings.dto';

export class CreateCheckoutDto {
  @ApiProperty({ required: false })
  @IsBoolean({ groups: ['create', 'update'] })
  @IsOptional({ groups: ['create', 'update'] })
  public default: boolean;

  @ApiProperty()
  @IsString({ groups: ['create', 'update'] })
  public name: string;

  @ApiProperty({ required: false })
  @IsString({ groups: ['create', 'update'] })
  @IsOptional({ groups: ['create', 'update'] })
  public logo?: string;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  @Type(() => CreateChannelSettingsDto)
  public channelSettings?: CreateChannelSettingsDto;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  @ValidateNested({ groups: ['create', 'update'] })
  @Type(() => CreateCheckoutSettingsDto)
  public settings?: CreateCheckoutSettingsDto;

  @ApiProperty({ required: false })
  @IsArray({ groups: ['create', 'update'] })
  @IsOptional({ groups: ['create', 'update'] })
  public sections?: CheckoutSectionInterface[];
}
