import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { TutorialInterface } from '../../interfaces';

export class TutorialDto implements TutorialInterface {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public icon: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public url: string;
}
