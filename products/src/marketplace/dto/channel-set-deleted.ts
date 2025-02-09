import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelSetDeletedDto {
  @IsNotEmpty()
  @IsString()
  public _id: string;
}
