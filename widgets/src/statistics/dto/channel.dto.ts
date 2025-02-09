import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelDto {
  @IsNotEmpty()
  @IsString()
  public type: string;
}
