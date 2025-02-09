import { IsString, IsNotEmpty } from 'class-validator';

export class ChannelSetActiveDto{
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @IsString()
  @IsNotEmpty()
  public channelSetId: string;
}
