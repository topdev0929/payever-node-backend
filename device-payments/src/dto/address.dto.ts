import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class AddressDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public country: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public city: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public zip_code: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public street: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  public phone_number: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEmail()
  public email: string;
}
