import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { AbstractGqlResolver, GqlAuthGuard } from '@pe/graphql-kit';
import { Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessService } from '../../../business/services';
import { ServiceExceptionFilter } from './service.exception.filter';

@Resolver()
@UseFilters(ServiceExceptionFilter)
@UseGuards(GqlAuthGuard)
@Roles(RolesEnum.anonymous)
export class BusinessResolver extends AbstractGqlResolver {
  constructor(
    private readonly businessService: BusinessService,
  ) {
    super();
  }

  @Query()
  public async getBusiness(
    @Args('businessId') business: string,
  ): Promise<any> {
    return this.businessService.getById(business);
  }
}
