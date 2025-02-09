import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class GetLabelDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public labelResponseType: 'B64' | 'URL';
}
