import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsIn, IsDate, IsDateString } from 'class-validator';

export class SettlementFilterRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsDateString()
  public start_date?: Date = null;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  public end_date?: Date = null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public currency?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public payment_method?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsIn(['paid', 'refund', 'cancel'])
  public operation_type?: string;
}
