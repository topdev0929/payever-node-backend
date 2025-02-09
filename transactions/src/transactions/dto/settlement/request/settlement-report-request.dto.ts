import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsNotEmpty, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { SettlementFilterRequestDto } from './settlement-filter-request.dto';
import { SettlementFormatTypeEnum } from '../../../enum';

export class SettlementReportRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SettlementFilterRequestDto)
  public filter?: SettlementFilterRequestDto;

  @ApiProperty()
  @IsOptional()
  @IsEnum(SettlementFormatTypeEnum)
  public format?: SettlementFormatTypeEnum;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  public fields?: string[];
}
