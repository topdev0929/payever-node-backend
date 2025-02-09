import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PostParseErrorDto {
  @IsOptional()
  @IsString()
  public sku?: string;

  @IsArray()
  @IsNotEmpty()
  public messages: string[];
}
