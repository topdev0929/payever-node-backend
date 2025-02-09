import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';


export class RegisterWithEncryptedPasswordDto {
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
  public password: string;

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
  @Transform(( name: string ) => name.trim())
  public firstName: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'forms.error.validator.required',
  })
  @IsString({
    message: 'forms.error.validator.invalid',
  })
  @Transform(( name: string ) => name.trim())
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
