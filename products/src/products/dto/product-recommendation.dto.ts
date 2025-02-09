import { Type } from 'class-transformer';
import {
  IsString,
  ValidateNested,
} from 'class-validator';
import { RecommendationItemDto } from '.';

export class ProductRecommendationDto {
  @IsString()
  public tag: string;

  @ValidateNested({ each: true })
  @Type(() => RecommendationItemDto)
  public recommendations: RecommendationItemDto[];
}
