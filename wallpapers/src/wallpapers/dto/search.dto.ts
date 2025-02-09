import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { SearchEnum } from '../enum';

export class SearchDto {
  @ApiProperty()
  @IsString()
  public searchText: string;

  @ApiProperty()
  @IsEnum(SearchEnum)
  public contains: SearchEnum;

  @ApiProperty()
  @IsString()
  public filter: string;
}
