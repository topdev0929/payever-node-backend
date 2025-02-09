import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { ChatMemberStatusEnum } from '@pe/message-kit';

export class MemberUpdateWsRequestDto {
  @ApiProperty({
    enum: ChatMemberStatusEnum,
  })
  @IsEnum(ChatMemberStatusEnum)
  @IsNotEmpty()
  public status: ChatMemberStatusEnum;
}
