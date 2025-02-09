import { ApiProperty } from '@nestjs/swagger';

import { ContentModelDto } from './content-model.dto';

export class ContentSelectModelDto extends ContentModelDto {
  @ApiProperty({ required: false })
  public data: any;
}
