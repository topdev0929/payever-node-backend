import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  public content: string;

  @ApiProperty()
  @IsOptional()
  public author: string;
}
