import { ApiProperty } from '@nestjs/swagger';
import { ChatMessageForwardFromInterface } from '@pe/message-kit';

export class ForwardFromHttpResponseDto implements ChatMessageForwardFromInterface {
  @ApiProperty()
  public _id: string;

  @ApiProperty({ required: false })
  public sender?: string;

  @ApiProperty({ required: false })
  public senderTitle?: string;

  @ApiProperty({ required: false })
  public messaging?: string;

  @ApiProperty({ required: false })
  public messagingTitle?: string;
}
