import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { DisplayOptionsDto } from './display-options-dto';

export class UpdateIntegrationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  public name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public category: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public displayOptions: DisplayOptionsDto;
}
