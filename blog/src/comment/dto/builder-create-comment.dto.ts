import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class BuilderCreateCommentDto {
  @ApiProperty()
  @IsString()
  public content: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public author: string;

  @ApiProperty()
  @IsString()
  public blogId: string;

  @ApiProperty()
  @IsString()
  public businessId: string;
}
