import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryAttributeDto } from './category-attribute.dto';
import { IsBusinessCategory, IsUniqueCategoryName, IsUniqueCategorySlug } from '../constraints';

export class UpdateCategoryDto {
  @ApiProperty({ required: true })
  @IsUniqueCategoryName('businessId', 'parent')
  @IsDefined()
  public name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  public businessId: string;

  @ApiProperty({ required: true })
  @IsBusinessCategory('businessId')
  public parent: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  public description?: string;

  @ApiProperty({ required: true })
  @IsUniqueCategorySlug('businessId', 'parent')
  @IsDefined()
  public slug: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public image?: string;

  @ApiProperty({ required: true })
  @IsDefined()
  @ValidateNested({ each: true})
  @Type(() => CategoryAttributeDto)
  public attributes: CategoryAttributeDto[];
}
