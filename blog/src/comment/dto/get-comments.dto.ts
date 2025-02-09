import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetCommentsDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public content: string;

  @ApiProperty()
  @IsOptional()
  public author: string;

  @ApiProperty()
  @IsString()
  public blogId: string;
}
