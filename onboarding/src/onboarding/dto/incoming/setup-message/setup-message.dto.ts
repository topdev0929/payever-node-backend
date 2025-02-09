import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  ValidateNested,
  ValidateIf,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import {
  SetupMessageInterface,
} from '../../../interfaces/incoming';
import { AppsSetupMessageDto } from './app-setup-message.dto';
import { BusinessSetupMessageDto } from './business-setup-message.dto';
import { CheckoutSetupMessageDto } from './checkout-setup-message.dto';
import { ConnectSetupMessageDto } from './connect-setup-message.dto';
import { ConnectSettingsSetupMessageDto } from './connect-settings-setup-message.dto';

export class SetupMessageDto implements SetupMessageInterface {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public template?: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => AppsSetupMessageDto)
  public apps?: AppsSetupMessageDto;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BusinessSetupMessageDto)
  @ValidateIf((object: SetupMessageDto) => Boolean(object.business || object.apps))
  public business: BusinessSetupMessageDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  public wallpaper: boolean;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => CheckoutSetupMessageDto)
  public checkout?: CheckoutSetupMessageDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => ConnectSetupMessageDto)
  public connect?: ConnectSetupMessageDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => ConnectSettingsSetupMessageDto)
  public ['connect-settings']?: ConnectSettingsSetupMessageDto;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public pos?: boolean;
}
