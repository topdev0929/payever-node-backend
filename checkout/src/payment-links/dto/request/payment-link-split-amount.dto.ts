import { Expose, Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

@Exclude()
export class PaymentLinkSplitAmountDto {
  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsNumber()
  public value?: number;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public currency?: string;
}
