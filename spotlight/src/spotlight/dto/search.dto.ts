import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class SearchDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public query: string;

  @ApiProperty()
  @IsNotEmpty()
  public filters: any = { };
}
