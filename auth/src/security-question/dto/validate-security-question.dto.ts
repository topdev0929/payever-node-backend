import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

@Exclude()
export class ValidateSecurityQuestionDto {

  public tokenId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  public answer: string;

  @IsOptional()
  @IsString()
  @Expose()
  public recaptchaToken?: string;
}
