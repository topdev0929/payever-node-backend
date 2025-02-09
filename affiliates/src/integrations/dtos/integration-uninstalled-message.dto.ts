import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethodsEnum } from '../enums';

export class IntegrationUninstalledMessageDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public category: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  public name: PaymentMethodsEnum;
}
