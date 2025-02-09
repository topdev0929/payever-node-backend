import { IsString, IsNotEmpty } from 'class-validator';

export class RemoveTerminalDto {
  @IsString()
  @IsNotEmpty()
  public id: string;
}
