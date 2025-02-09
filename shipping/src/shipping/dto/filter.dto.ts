import { IsString, IsNotEmpty, IsDefined } from 'class-validator';
import { FilterConditionsEnum } from '../enums';

export class FilterDto {
  @IsString()
  @IsNotEmpty()
  public field: string;
  @IsString()
  @IsNotEmpty()
  public condition: FilterConditionsEnum;
  @IsDefined()
  public value: any;
}
