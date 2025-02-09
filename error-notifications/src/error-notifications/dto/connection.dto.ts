import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectionDto {
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @IsNotEmpty()
  @IsString()
  public business: string;

  @IsNotEmpty()
  @IsString()
  public integration: string;
}
