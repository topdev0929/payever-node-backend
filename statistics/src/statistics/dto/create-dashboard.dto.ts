import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateDashboardDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public name: string;
}
