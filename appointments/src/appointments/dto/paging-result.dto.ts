import { PagingData } from './paging-data.dto';

export class PagingResultDto<T> {
  public collection: T[];
  public pagination_data?: PagingData;
  public filters: { } = { };
  public usage?: { } = { };
}
