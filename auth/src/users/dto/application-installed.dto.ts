import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ApplicationInstalledDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public code: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public userId?: string;
}
