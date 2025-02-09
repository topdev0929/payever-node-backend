import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { ConnectSettingsPayloadInterface } from '../../../interfaces/incoming';
import { DevicePaymentsMessageDto } from './device-payments.message.dto';
import { QrSetupMessageDto } from './qr-setup-message.dto';
import { SantanderSetupMessageDto } from './santander-invoice-setup-message.dto';
import { SantanderPosInstallmentDto } from './santander-pos-installment.dto';
import { TwilioSetupMessageDto } from './twilio-setup-message.dto';

export class ConnectSettingsSetupMessageDto implements ConnectSettingsPayloadInterface {

  @ApiProperty()
  @IsOptional()
  public santander_pos_installment: SantanderPosInstallmentDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => SantanderSetupMessageDto)
  public santander_invoice_de?: SantanderSetupMessageDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => SantanderSetupMessageDto)
  public santander_factoring_de?: SantanderSetupMessageDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => SantanderSetupMessageDto)
  public santander_pos_invoice_de?: SantanderSetupMessageDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => SantanderSetupMessageDto)
  public santander_pos_factoring_de?: SantanderSetupMessageDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => TwilioSetupMessageDto)
  public twilio?: TwilioSetupMessageDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => QrSetupMessageDto)
  public qr?: QrSetupMessageDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => DevicePaymentsMessageDto)
  public 'device-payments'?: DevicePaymentsMessageDto;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  public magento?: object;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  public shopify?: object;
}
