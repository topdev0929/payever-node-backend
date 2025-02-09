import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ChatMemberRoleEnum } from '../enums/chat-member-role.enum';

export class ChatMemberDto {
  @IsString()
  public user: string;

  @IsString()
  public role: ChatMemberRoleEnum;
}
