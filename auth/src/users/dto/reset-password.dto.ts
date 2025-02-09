import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { IsPasswordNotPwned, IsPasswordStrong } from '../../auth/constraints';

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @IsPasswordStrong()
  @IsPasswordNotPwned()
  public plainPassword: string;
}
