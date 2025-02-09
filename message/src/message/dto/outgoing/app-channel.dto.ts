// tslint:disable: max-union-size
import { ApiProperty } from '@nestjs/swagger';

import { AppChannel } from '../../submodules/messaging/app-channels';
import { ChatAppEnum } from '../../enums';
import { MemberHttpResponseDto } from './member.dto';
import { MessageHttpResponseDto } from './message.dto';
import { MessagingHttpResponseDto } from './messaging.dto';

export class AppChannelHttpResponseDto extends MessagingHttpResponseDto implements Pick<
  AppChannel,
  '_id' | 'expiresAt' | 
  'title' |
  'description' | 'photo' | 'signed' |
  'app'
> {
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public expiresAt?: Date;

  @ApiProperty()
  public messages: MessageHttpResponseDto[];

  @ApiProperty()
  public members?: MemberHttpResponseDto[];

  @ApiProperty()
  public removedMembers?: MemberHttpResponseDto[];

  @ApiProperty()
  public title: string;

  @ApiProperty()
  public description: string;

  @ApiProperty()
  public photo: string;

  @ApiProperty()
  public signed: boolean;

  @ApiProperty()
  public app: ChatAppEnum;
}
