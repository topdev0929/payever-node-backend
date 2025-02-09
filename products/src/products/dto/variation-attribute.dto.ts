import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AttributeTypesEnum } from '../../categories/enums';

export class VariationAttributeDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsEnum(AttributeTypesEnum)
  public type: AttributeTypesEnum;
}
