import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class RemoveProductDto {
  @IsOptional()
  @IsString()
  public _id?: string;

  @IsNotEmpty()
  @IsString()
  public sku: string;
}
