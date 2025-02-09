import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CommonActionDto } from './common-action.dto';
import { PaymentActionItemDto } from './payment-action-item.dto';
import { Type } from 'class-transformer';

export class RefundActionDto extends CommonActionDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public amount?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => PaymentActionItemDto)
  public payment_items?: PaymentActionItemDto[];
}
