import { IsNotEmpty, IsString } from 'class-validator';

export class ProductOptionDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
  @IsString()
  public value: string;
}
