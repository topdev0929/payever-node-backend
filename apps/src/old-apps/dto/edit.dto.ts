import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl, IsString } from 'class-validator';

export class EditDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsUrl()
  public appleStoreUrl?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsUrl()
  public playStoreUrl?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public minVersion?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public currentVersion?: string;
}
