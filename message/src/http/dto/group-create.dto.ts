import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { GroupChat } from '../../message/submodules/messaging/group-chats';
import { MemberHttpRequestDto } from './member.dto';

export class GroupCreateHttpRequestDto
  implements Pick<GroupChat,
  'title' | 'description' | 'photo'
> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public description: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public photo: string;

  @ApiProperty({ required: false, type: [MemberHttpRequestDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MemberHttpRequestDto)
  public members?: MemberHttpRequestDto[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  public parentFolderId?: string;
}
