import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsPasswordNotPwned, IsPasswordStrong } from '../../auth/constraints';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'forms.error.validator.required',
  })
  @IsString({
    message: 'forms.error.validator.email.invalid',
  })
  @IsEmail(undefined, {
    message: 'forms.error.validator.email.invalid',
  })
  @Transform((email: string) => email.toLowerCase())
  public email: string;

  @ApiProperty()
  @IsOptional()
  @IsString({
    message: 'forms.error.validator.plainPassword.invalid',
  })
  @MinLength(8, {
    message: 'forms.error.validator.plainPassword.minlength',
  })
  @MaxLength(32)
  @IsPasswordStrong()
  @IsPasswordNotPwned()
  public password?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public forceGeneratePassword: boolean;

  @ApiProperty()
  @IsNotEmpty({
    message: 'forms.error.validator.required',
  })
  @IsString({
    message: 'forms.error.validator.invalid',
  })
  public firstName: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'forms.error.validator.required',
  })
  @IsString({
    message: 'forms.error.validator.invalid',
  })
  public lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public recaptchaToken?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public inviteToken?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public language?: string;
}
