import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class UpdateSceneInfoDto {
  @ApiProperty()
  @IsArray()
  public tags: string[];

  @ApiProperty()
  @IsString()
  public name: string;
}
