import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class VariantOptionDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public value: string;

  @IsString()
  @IsOptional()
  public type: string;
}
