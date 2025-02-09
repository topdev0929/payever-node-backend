import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ChatMemberRoleEnum,
} from '@pe/message-kit';
import { ChatMember } from '../../message/submodules/platform';
import { MemberPermissionUpdateHttpRequestDto } from './member-permission-update.dto';

export class IncludeMemberHttpRequestDto implements Pick<ChatMember, 'role'> {
  @ApiProperty({ enum: Object.values(ChatMemberRoleEnum), required: false })
  @IsEnum(ChatMemberRoleEnum)
  @IsOptional()
  public role: ChatMemberRoleEnum;

  @ApiProperty()
  @ValidateNested()
  @IsOptional()
  @Type(() => MemberPermissionUpdateHttpRequestDto)
  public permissions?: MemberPermissionUpdateHttpRequestDto;
}
