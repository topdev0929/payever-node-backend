import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { SignupsInterface } from './signups.interface';

export class SignupsDto implements SignupsInterface {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public app: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public business_name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public country_code?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public form_name?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public full_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public phone: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public pricing?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public utm_source?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public website_url?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public source_host: string;
}
