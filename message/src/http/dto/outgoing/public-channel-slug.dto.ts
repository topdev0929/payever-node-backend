import { ApiProperty } from '@nestjs/swagger';

export class PublicChannelSlugDto {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public title: string;

  @ApiProperty()
  public slug?: string;

  @ApiProperty()
  public photo?: string;
}
