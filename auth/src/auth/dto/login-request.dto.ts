import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginRequestDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'forms.error.validator.required',
  })
  @IsString({
    message: 'forms.error.validator.email.invalid',
  })
  @IsEmail({ }, {
    message: 'forms.error.validator.email.invalid',
  })
  @Transform((email: string) => email.toLowerCase())
  public email: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty({
    message: 'forms.error.validator.required',
  })
  @IsString({
    message: 'forms.error.validator.plainPassword.invalid',
  })
  @MinLength(8, {
    message: 'forms.error.validator.plainPassword.minlength',
  })
  @MaxLength(32)
  public plainPassword: string;

  @ApiProperty()
  @IsOptional()
  @IsString({
    message: 'forms.error.validator.plainPassword.invalid',
  })
  public encryptedPassword: string;

  @IsOptional()
  @IsUUID('4')
  public channelSetId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public recaptchaToken?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public language?: string;
}
