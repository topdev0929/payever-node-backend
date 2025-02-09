import { BusinessReferenceDto } from './business-reference.dto';
import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BusinessAwareDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => BusinessReferenceDto)
  public business: BusinessReferenceDto;
}
