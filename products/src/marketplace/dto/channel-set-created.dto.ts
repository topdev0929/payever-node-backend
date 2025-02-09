import { IsNotEmpty, IsString } from 'class-validator';
import { ChannelMessageDto } from './channel-message.dto';
import { BusinessMessageDto } from './business-message.dto';

export class ChannelSetCreatedDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsNotEmpty()
  @IsString()
  public business: BusinessMessageDto;

  @IsNotEmpty()
  @IsString()
  public channel: ChannelMessageDto;
}
