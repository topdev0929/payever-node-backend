import { Injectable, Logger } from '@nestjs/common';

import { ElasticSearchClient } from '@pe/elastic-kit';
import { UserTokenInterface } from '@pe/nest-kit';
import { BusinessModel } from '@pe/business-kit';
import { SearchDto } from '../dto';

@Injectable()
export class BaseService {
  constructor(
    protected readonly elasticSearchClient: ElasticSearchClient,
    protected readonly logger: Logger,
  ) { }

  public search(
    dto: SearchDto,
    business: BusinessModel,
    user: UserTokenInterface,
  ): Promise<any> {
    throw new Error('You have to implement the method search!');
  }

  protected applyBusiness(
    field: string,
    businessId: string,
    filters: any = { },
  ): any {
    const phrase: any = { };
    phrase[field] = `${businessId}`;

    filters.must.push({
      match_phrase: phrase,
    });

    return filters;
  }

  protected createFiltersBody(): { must: any[]; must_not: any[] } {
    return {
      must: [],
      must_not : [],
    };
  }
}
