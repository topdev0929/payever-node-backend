import { IsNotEmpty, IsString } from 'class-validator';

export class ProductAttributeDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  public value: string;

  @IsString()
  @IsNotEmpty()
  public type: string;
}
