import { IsNotEmpty, IsString } from 'class-validator';

export class AdminCreateMailDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public businessId: string;
}
