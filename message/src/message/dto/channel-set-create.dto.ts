import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelSetCreateDto {
  @IsNotEmpty()
  @IsString()
  public channelName: string;

  @IsNotEmpty()
  @IsString()
  public channelType: string;
}
