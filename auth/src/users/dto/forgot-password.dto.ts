import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
export class ForgotPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Transform((email: string) => email.toLowerCase())
  public email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public recaptchaToken?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public language?: string;
}
