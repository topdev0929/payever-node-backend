import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { TaxesInterface } from '../../interfaces';

export class TaxesDto implements TaxesInterface {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public companyRegisterNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public taxId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public taxNumber: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  public turnoverTaxAct: boolean;
}
