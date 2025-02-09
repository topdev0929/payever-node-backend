import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveTerminalDto {
  @IsString()
  @IsNotEmpty()
  public id: string;
}
