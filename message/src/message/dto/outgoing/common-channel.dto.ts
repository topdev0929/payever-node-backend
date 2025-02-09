// tslint:disable: max-union-size
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsEnum,
} from 'class-validator';
import { CommonChannel } from '../../../message/submodules/messaging/common-channels';
import { MessagingHttpResponseDto } from './messaging.dto';
import { ChannelTypeEnum } from '../../../message/enums';
import { MessageHttpResponseDto } from './message.dto';
import { MemberHttpResponseDto } from '../../../message/dto/outgoing/member.dto';
import { MessagingIntegrationsEnum } from '@pe/message-kit';
import { PermissionsHttpResponseDto } from './permissions.dto';

export class CommonChannelHttpResponseDto extends MessagingHttpResponseDto implements Pick<
  CommonChannel,
  '_id' | 'lastMessages' | 'contacts' |
  'title' | 'members' | 'integrationName' | 'slug' |
  'description' | 'photo' | 'subType' | 'signed'
> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public _id: string;

  @ApiProperty()
  @IsString({ each: true })
  public contacts: string[];

  @ApiProperty()
  @IsEnum(MessagingIntegrationsEnum)
  public integrationName: MessagingIntegrationsEnum;

  @ApiProperty({ required: false })
  @IsString()
  public slug?: string;

  //  Backward compatibility
  @ApiProperty()
  @IsObject({ each: true })
  public messages: MessageHttpResponseDto[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public description: string;

  @ApiProperty()
  public members: MemberHttpResponseDto[];

  @ApiProperty()
  public subType: ChannelTypeEnum;

  @ApiProperty()
  public photo: string;

  @ApiProperty()
  public signed: boolean;

  @ApiProperty()
  public usedInWidget: boolean;

  @ApiProperty()
  public permissions?: PermissionsHttpResponseDto;
}
