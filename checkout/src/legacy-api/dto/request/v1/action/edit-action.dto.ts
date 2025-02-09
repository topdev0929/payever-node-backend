import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { CommonActionDto } from './common-action.dto';

export class EditActionDto extends CommonActionDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public amount?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public delivery_fee?: number;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  public payment_items?: [];
}
