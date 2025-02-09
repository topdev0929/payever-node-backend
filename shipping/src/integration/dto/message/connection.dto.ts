import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectionDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsNotEmpty()
  @IsString()
  public name: string;
}
