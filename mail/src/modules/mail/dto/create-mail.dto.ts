import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMailDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
}
