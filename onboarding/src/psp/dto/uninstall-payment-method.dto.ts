import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UninstallPaymentMethodDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public type: string;
}
