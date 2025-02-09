import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelNamedDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsNotEmpty()
  @IsString()
  public name: string;
}
