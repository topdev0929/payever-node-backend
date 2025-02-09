import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CollectionModel } from '../models';
import { PaginatedListInfoDto } from './paginated-list-info.dto';

export class PaginatedCollectionsListDto {
  @IsDefined()
  public collections: CollectionModel[];

  @ValidateNested()
  @IsDefined()
  @Type(() => PaginatedListInfoDto)
  public info: PaginatedListInfoDto;
}
