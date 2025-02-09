import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CompanyDetailsDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public businessStatus: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public legalForm: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public product: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public industry: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public urlWebsite: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public foundationYear: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public status: string;
}
