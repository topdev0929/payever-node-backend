import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ConfirmEmployeeDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public recaptchaToken?: string;
}
