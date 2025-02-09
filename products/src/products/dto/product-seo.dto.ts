import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ProductSeoDto {
  @IsString()
  @IsOptional()
  @MaxLength(55)
  public title: string;

  @IsString()
  @IsOptional()  
  public description: string;
}
