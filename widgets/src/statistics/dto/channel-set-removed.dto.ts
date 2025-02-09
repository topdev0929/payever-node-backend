import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelSetRemovedDto {
  @IsNotEmpty()
  @IsString()
  public _id: string;
}
