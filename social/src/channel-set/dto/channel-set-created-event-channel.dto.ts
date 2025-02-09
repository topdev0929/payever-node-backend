import { IsNotEmpty, IsString } from 'class-validator';
export class ChannelSetCreatedEventChannelDto {
  @IsNotEmpty()
  @IsString()
  public readonly type: string;
}
