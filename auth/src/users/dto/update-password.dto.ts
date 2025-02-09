import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { IsPasswordNotPwned, IsPasswordStrong } from '../../auth/constraints';

export class UpdatePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public oldPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsPasswordStrong()
  @IsPasswordNotPwned()
  @MinLength(8)
  @MaxLength(32)
  public newPassword: string;
}
