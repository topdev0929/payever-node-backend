import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentOptionsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public business_uuid: string;

  @ApiProperty()
  @IsNotEmpty()
  public payment_option_name: string;

  @ApiProperty()
  @IsNotEmpty()
  public status: string;
}
