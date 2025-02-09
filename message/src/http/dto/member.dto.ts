import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { ChatMember } from 'src/message/submodules/platform';
import { IncludeMemberHttpRequestDto } from './include-member.dto';

export class MemberHttpRequestDto
  extends IncludeMemberHttpRequestDto
  implements Pick<ChatMember, 'role' | 'user'> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public user: string;
}
