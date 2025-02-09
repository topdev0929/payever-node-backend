import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DashboardInfoDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public icon: string;
}
