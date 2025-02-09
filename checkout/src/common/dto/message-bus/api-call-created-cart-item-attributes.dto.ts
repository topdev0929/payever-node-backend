import { IsNumber } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiCallCreatedCartItemAttributesDimensionsDto } from './api-call-created-cart-item-attributes-dimensions.dto';

@Exclude()
export class ApiCallCreatedCartItemAttributesDto {
  @IsNumber()
  @Expose()
  public weight?: number;

  @Type(() => ApiCallCreatedCartItemAttributesDimensionsDto)
  @Expose()
  public dimensions?: ApiCallCreatedCartItemAttributesDimensionsDto;
}
