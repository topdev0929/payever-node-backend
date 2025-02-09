import { IsNotEmpty, IsString } from 'class-validator';

export class ItemOptionDto {
  @IsString()
  @IsNotEmpty()

  public name: string;
  @IsString()
  @IsNotEmpty()
  public value: string;
}
