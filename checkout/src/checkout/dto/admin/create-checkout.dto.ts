import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

import { CheckoutSectionInterface } from '../../interfaces';
import { CreateChannelSettingsDto } from '../create-channel-settings.dto';
import { CreateCheckoutSettingsDto } from '../create-checkout-settings.dto';

export class AdminCreateCheckoutDto {
  @ApiProperty()
  @IsString({ groups: ['create', 'update'] })
  @IsNotEmpty({ groups: ['create', 'update'] })
  public businessId: string;

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
  public channelSettings?: CreateChannelSettingsDto;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  @ValidateNested({ groups: ['create', 'update'] })
  public settings?: CreateCheckoutSettingsDto;

  @ApiProperty({ required: false })
  @IsArray({ groups: ['create', 'update'] })
  @IsOptional({ groups: ['create', 'update'] })
  public sections?: CheckoutSectionInterface[];
}
