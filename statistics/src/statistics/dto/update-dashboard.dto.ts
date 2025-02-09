import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDashboardDto  {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public name: string;
}
