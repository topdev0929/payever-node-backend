import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UserAccountDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public lastName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public phone?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public logo?: string;
}
