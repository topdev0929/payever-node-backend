import { IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryAttributeDto } from './category-attribute.dto';
import { ParentCategoryDto } from './parent-category.dto';
import { BusinessReferenceDto } from './business-reference.dto';

export class CategoryDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @ValidateNested()
  @Type(() => BusinessReferenceDto)
  @IsDefined()
  public business: BusinessReferenceDto;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @ValidateNested()
  @Type(() => ParentCategoryDto)
  public parent?: ParentCategoryDto;

  @ValidateNested({ each: true})
  @Type(() => ParentCategoryDto)
  public ancestors?: ParentCategoryDto[];

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public slug: string;

  @IsString()
  @IsNotEmpty()
  public image?: string;

  @ValidateNested({ each: true})
  @Type(() => CategoryAttributeDto)
  public attributes: CategoryAttributeDto[];

  @ValidateNested({ each: true})
  @Type(() => CategoryAttributeDto)
  public inheritedAttributes: CategoryAttributeDto[];
}
