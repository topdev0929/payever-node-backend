import { URL } from 'url';
import { ApiProperty } from '@nestjs/swagger';
import {
  ValidateNested,
  IsOptional,
} from 'class-validator';
import {
  Transform,
  Type,
  plainToClass,
} from 'class-transformer';

import { ConnectSettingsPayloadInterface } from '../../../interfaces/incoming';
import { SantanderSetupMessageDto } from '../setup-message/santander-invoice-setup-message.dto';
import { TwilioSetupMessageDto } from '../setup-message/twilio-setup-message.dto';
import { QrSetupMessageDto } from '../setup-message/qr-setup-message.dto';
import { DevicePaymentsMessageDto } from '../setup-message/device-payments.message.dto';
import { trulyStringToBoolean } from '../../../transformers';
import { SantanderPosInstallmentDto } from '../setup-message/santander-pos-installment.dto';

function castIfDefined<T extends (val: U) => any, U>(value: U, fn: T): ReturnType<T> {
  return value ? fn(value) : undefined;
}

export function santanderParser(value: string): SantanderSetupMessageDto {
  const parsed: URL = new URL(`creds://${value}`);

  return plainToClass(SantanderSetupMessageDto, {
    login: parsed.username,
    password: parsed.password,

    channel: parsed.searchParams.get('channel') || undefined,
    connectionName: parsed.searchParams.get('connectionName') || undefined,
    sender: parsed.searchParams.get('sender') || undefined,
  });
}

export function santanderPosInstallmentParser(value: string): SantanderPosInstallmentDto {
  const parsed: URL = new URL(`creds://${value}`);

  return plainToClass(SantanderPosInstallmentDto, {
    connectionName: parsed.searchParams.get('connectionName') || undefined,
    connections: parsed.searchParams.get('connections') || [],
    password: parsed.searchParams.get('password'),
    vendorNumber: parsed.searchParams.get('vendor'),
  });
}
export class ConnectSettingsCellDto implements ConnectSettingsPayloadInterface {
  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Transform(santanderPosInstallmentParser)
  @Type(() => SantanderPosInstallmentDto)
  public santander_pos_installment?: SantanderPosInstallmentDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Transform(santanderParser)
  @Type(() => SantanderSetupMessageDto)
  public santander_invoice_de?: SantanderSetupMessageDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Transform(santanderParser)
  @Type(() => SantanderSetupMessageDto)
  public santander_factoring_de?: SantanderSetupMessageDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Transform(santanderParser)
  @Type(() => SantanderSetupMessageDto)
  public santander_pos_invoice_de?: SantanderSetupMessageDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Transform(santanderParser)
  @Type(() => SantanderSetupMessageDto)
  public santander_pos_factoring_de?: SantanderSetupMessageDto;

  @ApiProperty()
  @IsOptional()
  @Transform((value: string) => {
    const parsed: URL = new URL(`creds://${value}`);

    return plainToClass(TwilioSetupMessageDto, {
      accountSid: parsed.username,
      authToken: parsed.password,
    });
  })
  public twilio?: TwilioSetupMessageDto;

  @ApiProperty()
  @IsOptional()
  @Transform((value: string) => {
    const parsed: URL = new URL(`creds://${value}`);

    return plainToClass(QrSetupMessageDto, {
      displayAvatar: castIfDefined(parsed.searchParams.get('displayAvatar'), trulyStringToBoolean),
      type: parsed.searchParams.get('type') || undefined,
    });
  })
  public qr?: QrSetupMessageDto;

  @ApiProperty()
  @IsOptional()
  @Transform((value: string) => {
    const parsed: URL = new URL(`creds://${value}`);

    return plainToClass(DevicePaymentsMessageDto, {
      autoresponderEnabled: castIfDefined(parsed.searchParams.get('autoresponderEnabled'), trulyStringToBoolean),
      secondFactor: castIfDefined(parsed.searchParams.get('secondFactor'), trulyStringToBoolean),
      verificationType: castIfDefined(parsed.searchParams.get('verificationType'), Number),
    });
  })
  public 'device-payments'?: DevicePaymentsMessageDto;

  @ApiProperty()
  @IsOptional()
  @Transform((value: string) => {
    return { };
  })
  public magento?: object;

  @ApiProperty()
  @IsOptional()
  @Transform((value: string) => {
    return { };
  })
  public shopify?: object;
}
