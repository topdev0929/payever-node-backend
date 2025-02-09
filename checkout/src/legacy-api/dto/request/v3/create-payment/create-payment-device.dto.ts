import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePaymentDeviceBrowserDto } from './create-payment-device-browser.dto';

export class CreatePaymentDeviceDto {
  @ApiProperty()
  @ValidateNested({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  @Type(() => CreatePaymentDeviceBrowserDto)
  public browser?: CreatePaymentDeviceBrowserDto;

  @ApiProperty()
  @IsString({ groups: ['client_ip_required']})
  @IsNotEmpty({ groups: ['client_ip_required'] })
  @IsOptional({ groups: ['link']})
  public client_ip?: string;
}
