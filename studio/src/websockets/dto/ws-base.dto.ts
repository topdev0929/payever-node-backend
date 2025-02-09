import { IsNotEmpty, IsString } from 'class-validator';

export class WsBaseDto {
  @IsString()
  @IsNotEmpty()
  public token: string;

  @IsString()
  @IsNotEmpty()
  public id: string;
}
