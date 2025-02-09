// tslint:disable: max-union-size
import { ApiProperty } from '@nestjs/swagger';

import { MessagingHttpResponseDto } from './messaging.dto';
import { SupportChannel } from '../../submodules/messaging/support-channels';

export class SupportChannelHttpResponseDto extends MessagingHttpResponseDto implements Pick<
  SupportChannel,
  '_id' | 'lastMessages' |
  'title' | 'description' | 'photo' | 'signed'
> {
  @ApiProperty({ required: false })
  public description: string;

  @ApiProperty()
  public photo: string;

  @ApiProperty()
  public signed: boolean;
}
