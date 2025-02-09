import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class ChannelSetDto {
  @IsString()
  @Expose({ name: '_id' })
  public readonly uuid: string;

  @IsString()
  @Expose({ name: 'type' })
  public readonly channel_type: string;
}
