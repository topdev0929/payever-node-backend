import { ApiProperty } from '@nestjs/swagger';
import { IsCountryCode } from '@pe/common-sdk';
import { IsOptional, IsString } from 'class-validator';
import { BankAccountInterface } from '../../interfaces';

export class BankAccountDto implements BankAccountInterface {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsCountryCode()
  public country: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public city: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public bankName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public bankCode: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public swift: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public routingNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public accountNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public owner: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public bic: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public iban: string;
}
