import { IsArray, IsString, IsOptional } from 'class-validator';

export class RecommendationItemDto {
  @IsString()
  public id: string;

  @IsOptional()
  @IsArray()
  @IsString({
      each: true,
  })
  public images?: string[];

  @IsOptional()
  @IsString()
  public name: string;

  @IsOptional()
  @IsString()
  public sku?: string;
}
