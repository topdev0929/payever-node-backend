import { IsArray, IsNotEmpty } from 'class-validator';
import { MediaAttributeInterface } from '../interfaces';

export class AttributeFilterDto {
  @IsArray()
  @IsNotEmpty()
  public attributes: MediaAttributeInterface[];
}
