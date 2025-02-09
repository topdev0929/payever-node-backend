import { ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessReferenceDto } from '../business-reference.dto';
import { RemoveProductDto } from './remove-product.dto';

export class RemoveProductMessageDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => BusinessReferenceDto)
  public business: BusinessReferenceDto;

  @ValidateNested()
  @IsDefined()
  @Type(() => RemoveProductDto)
  public payload: RemoveProductDto;
}
