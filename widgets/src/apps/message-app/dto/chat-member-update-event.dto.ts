import { ChatMemberDto } from './chat-member.dto';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class ChatMemberUpdateDto {
  @IsString()
  @IsNotEmpty()
  public chatId: string;

  @Type(() => ChatMemberDto)
  @ValidateNested()
  public member: ChatMemberDto;
}
