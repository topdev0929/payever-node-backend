import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DuplicatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public id: string;
}
