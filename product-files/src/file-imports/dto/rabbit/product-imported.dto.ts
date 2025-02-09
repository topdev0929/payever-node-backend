import { IsDefined, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessReferenceDto, SynchronizationTaskReferenceDto } from '../';
import { PostParseErrorDto } from '../../../file-processor/dto';
import { ProductDto } from '../products';

export class ProductImportedDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => BusinessReferenceDto)
  public business: BusinessReferenceDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => SynchronizationTaskReferenceDto)
  public synchronization: SynchronizationTaskReferenceDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PostParseErrorDto)
  public errors?: PostParseErrorDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => ProductDto)
  public data: ProductDto;
}
