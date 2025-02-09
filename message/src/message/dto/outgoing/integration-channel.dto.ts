// tslint:disable: max-union-size
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { CommonChannel } from '../../submodules/messaging/common-channels';
import { MessagingHttpResponseDto } from './messaging.dto';
import { MessageHttpResponseDto } from './message.dto';

export class IntegrationChannelHttpResponseDto extends MessagingHttpResponseDto implements Pick<
  CommonChannel,
  '_id' |
  'title' |
  'photo' |
  'usedInWidget' |
  'description'
> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public _id: string;

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

  @ApiProperty()
  @IsBoolean()
  public usedInWidget: boolean;

  @ApiProperty()
  @IsObject({ each: true })
  public messages: MessageHttpResponseDto[];
}
