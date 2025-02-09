import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubmitPaymentRequestDto {
  @ApiProperty({ required: true})
  @IsNotEmpty()
  @IsString()
  public flowId: string;
}
