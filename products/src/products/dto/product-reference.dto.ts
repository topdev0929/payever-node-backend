import { IsNotEmpty, IsString } from 'class-validator';

export class ProductReferenceDto {
  @IsString()
  @IsNotEmpty()
  public id: string;
}
