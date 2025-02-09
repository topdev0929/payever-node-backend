import { ApiProperty } from '@nestjs/swagger';

import { ContentInterface } from '../interfaces';

export class ContentModelDto implements ContentInterface {
  @ApiProperty()
  public _id: string;

  @ApiProperty({ nullable: true })
  public business?: string;

  @ApiProperty({ example: '#icon-products' })
  public icon: string;

  @ApiProperty()
  public name: string;

  @ApiProperty({ example: '' })
  public url: string;
}
