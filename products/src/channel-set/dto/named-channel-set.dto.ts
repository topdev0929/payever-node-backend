import { IsNotEmpty, IsString } from 'class-validator';

export class NamedChannelSetDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsNotEmpty()
  @IsString()
  public name: string;
}
