// tslint:disable: max-union-size
import { ApiProperty } from '@nestjs/swagger';
import { MessageHttpResponseDto } from '.';


export class PinnedMessageHttpResponseDto extends MessageHttpResponseDto {
  @ApiProperty({ required: true })
  public pinId: string;
}
