import { PaymentLinkMessageInterface } from '../../interfaces';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

@Exclude()
export class PaymentLinkMessageDto implements PaymentLinkMessageInterface {
  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  content?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  subject?: string;
}
