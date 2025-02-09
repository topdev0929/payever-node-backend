import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
} from 'class-validator';

import {
  ChatMessageForwardFromInterface,
} from '@pe/message-kit';

export class ForwardFromMessageDto implements ChatMessageForwardFromInterface {
  @ApiProperty()
  @IsUUID(4)
  public _id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public sender?: string;
}
