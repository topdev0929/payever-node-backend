import { IsNotEmpty, IsString } from 'class-validator';
import { PaymentMethodsEnum } from '../../subscriptions/enums';
import { ApiProperty } from '@nestjs/swagger';

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
