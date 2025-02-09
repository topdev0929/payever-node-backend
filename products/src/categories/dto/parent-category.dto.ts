import { IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessReferenceDto } from './business-reference.dto';

export class ParentCategoryDto {
  @IsString()
  @IsNotEmpty()
  public id: any;

  @ValidateNested()
  @Type(() => BusinessReferenceDto)
  @IsDefined()
  public business: BusinessReferenceDto;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public slug: string;

  @IsString()
  @IsNotEmpty()
  public image?: string;
}
