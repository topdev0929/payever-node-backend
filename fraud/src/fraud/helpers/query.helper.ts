import { PaginatedDto, ItemsQueryRequestDto } from '../dto';
import * as dateFns from 'date-fns';

export class QueryHelper {

  public static preparePaginatedDto(businessId: string, query: ItemsQueryRequestDto): PaginatedDto {
    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const offset: number = (page - 1) * limit;

    let condition: any = {
      businessId: businessId,
    };

    if ( query.from ) {
      condition = {
        ...condition,
        createdAt: { $gte: query.from },
      };
    }
    if ( query.to ) {
      condition = {
        ...condition,
        createdAt: { $lt: dateFns.addDays(query.to, 1) },
      };
    }

    return {
      condition,
      limit,
      offset,
      page,
    };
  }

}
