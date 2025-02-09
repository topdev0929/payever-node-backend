import { IsNotEmpty, IsString } from 'class-validator';
import { FilterConditionsEnum } from '../enums';

export class FilterDto {
  @IsString()
  @IsNotEmpty()
  public field: string;

  @IsString()
  @IsNotEmpty()
  public condition: FilterConditionsEnum;

  @IsString({ each: true})
  @IsNotEmpty()
  public value: string | string[];
}
