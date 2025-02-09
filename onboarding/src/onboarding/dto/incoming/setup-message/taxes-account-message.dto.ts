import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class TaxesAccountMessageDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public companyRegisterNumber?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public taxId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public taxNumber?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public turnoverTaxAct?: boolean;
}
