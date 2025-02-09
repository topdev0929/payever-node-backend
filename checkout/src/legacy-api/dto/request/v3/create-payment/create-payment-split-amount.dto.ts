import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentSplitAmountDto {
  @ApiProperty({ required: false})
  @IsNumber({ }, { groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public value?: number;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public currency?: string;
}
