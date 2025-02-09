import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDefined, IsOptional } from 'class-validator';
import { CreateLocationDto } from '.';

export class AdminLocationDto extends CreateLocationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public businessId: string;
}
