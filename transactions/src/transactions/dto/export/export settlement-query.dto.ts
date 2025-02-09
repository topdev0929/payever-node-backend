import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsIn, IsDate } from 'class-validator';
import { PaymentStatusesEnum } from '../../enum';

export class ExportSettlementQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsDate()
  public start_date?: Date = null;

  @ApiProperty()
  @IsOptional()
  @IsDate()
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

  @ApiProperty()
  @IsOptional()
  @IsString()
  public business_id?: string = null;
}
