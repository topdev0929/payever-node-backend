import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { TaxesInterface } from '../../interfaces';

export class TaxesDto implements TaxesInterface {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public companyRegisterNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public taxId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public taxNumber: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public turnoverTaxAct: boolean;
}
