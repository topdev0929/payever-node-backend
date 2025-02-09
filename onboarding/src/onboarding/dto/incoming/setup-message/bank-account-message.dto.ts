import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
} from 'class-validator';

export class BankAccountMessageDto {
  @ApiProperty()
  @IsString()
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
