import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ProductCategoryDto {
  @IsOptional()
  @IsString()
  public id?: string;

  @IsOptional()
  @IsUUID('4')
  public businessId?: string;

  @IsOptional()
  @IsUUID('4')
  public businessUuid?: string;

  @IsString()
  public title: string;

  @IsOptional()
  @IsString()
  public slug?: string;
}
