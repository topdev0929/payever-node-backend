import { CommonActionDto } from './common-action.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class InvoiceActionDto extends CommonActionDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public amount?: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  public paidAt?: Date;
}
