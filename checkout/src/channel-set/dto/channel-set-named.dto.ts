import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelSetNamedDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsNotEmpty()
  @IsString()
  public name: string;
}
