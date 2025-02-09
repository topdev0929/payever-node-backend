import { ApiProperty } from '@nestjs/swagger';
import { AbstractChatMessage, Pinned } from '../../submodules/platform/schemas';

export class PinnedResponseDto implements Pinned {
  public notifyAllMembers?: boolean;
  public message: AbstractChatMessage;
  @ApiProperty()
  public _id: string;

  @ApiProperty()
  public messageId: string;

  @ApiProperty()
  public pinner: string;

  @ApiProperty()
  public forAllUsers: boolean;  

  @ApiProperty()
  public contacts?: string[];
}
