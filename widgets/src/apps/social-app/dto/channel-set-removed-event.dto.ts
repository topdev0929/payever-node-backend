import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelSetRemovedEventDto {
  @IsNotEmpty()
  @IsString()
  public readonly _id: string;
}
