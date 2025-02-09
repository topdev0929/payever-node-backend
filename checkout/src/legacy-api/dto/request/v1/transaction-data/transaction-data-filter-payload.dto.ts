import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class TransactionDataFilterPayloadDto {
  @ApiProperty()
  @IsOptional()
  @IsDateString()
  public startDate?: Date = null;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  public endDate?: Date = null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public paymentMethod?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public businessId?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Transform((value: any) => (value ? Number(value) : null))
  public start?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Transform((value: any) => (value ? Number(value) : null))
  public limit?: number;
}
