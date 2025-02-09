import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { DisplayOptionsDto } from './display-options-dto';

export class CreateIntegrationDto {
  @ApiProperty()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsNotEmpty()
  public category: string;

  @ApiProperty()
  @IsOptional()
  public displayOptions: DisplayOptionsDto;
}
