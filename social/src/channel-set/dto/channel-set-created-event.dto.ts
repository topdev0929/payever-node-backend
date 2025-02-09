import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ChannelSetCreatedEventChannelDto } from './channel-set-created-event-channel.dto';
import { ChannelSetCreatedEventBusinessDto } from './channel-set-created-event-business.dto';

export class ChannelSetCreatedEventDto {
  @IsNotEmpty()
  @IsString()
  public readonly id: string;

  @IsNotEmpty()
  @ValidateNested()
  public readonly channel: ChannelSetCreatedEventChannelDto;

  @IsNotEmpty()
  @ValidateNested()
  public readonly business: ChannelSetCreatedEventBusinessDto;
}
