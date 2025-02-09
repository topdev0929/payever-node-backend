import { ApiProperty } from '@nestjs/swagger';

export class LinkModelDto {

  @ApiProperty()
  public type: string;

  @ApiProperty()
  public url: string;
}
