import { IsNotEmpty, IsString } from 'class-validator';

export class ProductOptionDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public value: string;
}
