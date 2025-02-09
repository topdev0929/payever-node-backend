import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BusinessMessageDto } from './business-message.dto';
import { ChannelMessageDto } from './channel-message.dto';

export class ChannelSetCreatedDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @Type(() => BusinessMessageDto)
  public business: BusinessMessageDto;

  @Type(() => ChannelMessageDto)
  public channel: ChannelMessageDto;

  @IsOptional()
  @IsString()
  public type: string;
}
