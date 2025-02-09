import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelSetDto {
  @IsNotEmpty()
  @IsString()
  public id: string;
}
