import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, IsOptional, IsString } from 'class-validator';

import { IsPasswordNotPwned, IsPasswordStrong } from '../../../auth/constraints';

export class EmployeeConfirmation {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @IsPasswordNotPwned()
  @IsPasswordStrong()
  public password: string;

  @ApiProperty()
  @IsNotEmpty()
  public firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  public lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  public businessId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public recaptchaToken?: string;
}
