import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class GetSceneInfoDto extends PaginationDto{
  @ApiProperty()
  @IsString()
  public video: string;
}
