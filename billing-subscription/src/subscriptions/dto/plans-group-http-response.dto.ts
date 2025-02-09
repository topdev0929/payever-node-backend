import { ApiProperty } from '@nestjs/swagger';
import { PlansGroupHttpBodyDto } from './plans-group.dto';

export class PlansGroupHttpResponseDto extends PlansGroupHttpBodyDto {
  @ApiProperty()
  public readonly _id: string;

}
