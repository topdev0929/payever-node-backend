import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentCodeUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public invoice_id: string;
}
