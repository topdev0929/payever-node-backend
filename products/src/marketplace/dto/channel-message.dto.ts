import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelMessageDto {
  @IsNotEmpty()
  @IsString()
  public type: string;
}
