import { ApiProperty } from '@nestjs/swagger';

export class DisplayOptionsDto {

  @ApiProperty()
  public title: string;

  @ApiProperty()
  public icon: string;
}
