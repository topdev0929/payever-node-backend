import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CategoryAttributeInterface } from '../interfaces';
import { AttributeTypesEnum } from '../enums';

export class CategoryAttributeDto implements CategoryAttributeInterface {
  @IsString()
  @IsNotEmpty()
  public name: string;
  @IsBoolean()
  public isDefault: boolean;
  @IsEnum(AttributeTypesEnum)
  public type: AttributeTypesEnum;
}
