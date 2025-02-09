import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectionDto {
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @IsNotEmpty()
  @IsString()
  public businessId: string;

  @IsNotEmpty()
  @IsString()
  public integration: string;
}
