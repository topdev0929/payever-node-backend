import { ApiProperty } from '@nestjs/swagger';
import { IsLanguage } from '@pe/common-sdk';
import { IsOptional, IsString } from 'class-validator';

export class UserAccountDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsLanguage()
  public language?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public salutation?: string;

  @ApiProperty()
  @IsString()
  public firstName: string;

  @ApiProperty()
  @IsString()
  public lastName: string;

  @ApiProperty()
  @IsString()
  public email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public birthday?: string;
}
