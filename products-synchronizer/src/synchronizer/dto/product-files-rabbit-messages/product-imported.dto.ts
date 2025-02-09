import { ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { SynchronizationTaskIdReferenceDto } from '../synchronization-task-id-reference.dto';
import { ProductDto } from '../products';

export class ProductImportedDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => SynchronizationTaskIdReferenceDto)
  public synchronization: SynchronizationTaskIdReferenceDto;

  @ValidateNested()
  @IsDefined()
  @Type(() => ProductDto)
  public data: ProductDto;
}
