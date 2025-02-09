import { IsNotEmpty, IsString, IsOptional, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ChatMemberDto } from './chat-member.dto';
import { MessagingTypeEnum } from '../enums';

export class ChatEventDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsOptional()
  public businessId: string;

  @IsOptional()
  public lastSeen?: Date;

  @IsString()
  @IsOptional()
  public photo?: string;

  @IsString()
  @IsOptional()
  public name: string;

  @Type(() => ChatMemberDto)
  @ValidateNested()
  public members: ChatMemberDto[];

  @IsEnum({
    enum: MessagingTypeEnum,
  })
  public type: MessagingTypeEnum;
}
