import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentFlowDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public paymentFlowId: string;
}
