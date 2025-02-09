import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AttributeTypesEnum } from '../../categories/enums';

export class ProductAttributeDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsEnum(AttributeTypesEnum)
  public type: AttributeTypesEnum;

  @IsString()
  public value: string;
}
