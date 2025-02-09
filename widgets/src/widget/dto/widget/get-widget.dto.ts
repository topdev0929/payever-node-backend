import { ApiProperty } from '@nestjs/swagger';
import { WidgetInterface } from '../../interfaces';
import { TutorialDto } from './tutorial.dto';
import { Type } from 'class-transformer';

export class GetWidgetDto implements WidgetInterface {
  @ApiProperty()
  public type: string;

  @ApiProperty()
  public title: string;

  @ApiProperty()
  public icon: string;

  @ApiProperty()
  public default: boolean;

  @ApiProperty()
  public helpURL: string;

  @ApiProperty()
  @Type(() => TutorialDto)
  public tutorial: TutorialDto;

  @ApiProperty()
  public order: number;

  @ApiProperty()
  public createdAt: string;

  @ApiProperty()
  public updatedAt: string;
}
