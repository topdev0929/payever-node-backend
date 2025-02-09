import { ApiProperty } from '@nestjs/swagger';

export class SearchResultDto {
  @ApiProperty()
  public result: any[];

  @ApiProperty()
  public total: any;
}
