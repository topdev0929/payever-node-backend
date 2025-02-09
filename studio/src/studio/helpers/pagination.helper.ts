import { PaginationDto } from '../dto';
import { PaginationInterface } from '../interfaces';

export class PaginationHelper {
  public static getPagination(pagination: PaginationDto): PaginationInterface {
    const limit: number = pagination.limit ? parseInt(pagination.limit, 10) : 10;
    const skip: number = pagination.page ? (parseInt(pagination.page, 10) - 1) * limit : 0;

    return {
      limit: limit,
      skip: skip,
    };
  }

  public static getSortQuery(pagination: PaginationDto, defaultSort?: any): any {
    const asc: string[] = pagination.asc ?
      (typeof pagination.asc === 'string') ? [pagination.asc] : pagination.asc
      : [];
    const desc: string[] = pagination.desc ?
      (typeof pagination.desc === 'string') ? [pagination.desc] : pagination.desc
      : [];
    let sortQuery: any = { };

    asc.forEach((sort: string) => {
      sortQuery[sort] = 1;
    });
    desc.forEach((sort: string) => {
      sortQuery[sort] = -1;
    });

    if (Object.keys(sortQuery).length === 0 ) {
      if (defaultSort) {
        return defaultSort;
      } else {
        sortQuery = {
          updatedAt: -1,
        };
      }
    }

    return sortQuery;
  }
}
