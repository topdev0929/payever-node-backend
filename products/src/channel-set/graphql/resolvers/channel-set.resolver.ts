import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { AbstractGqlResolver, GqlAuthGuard } from '@pe/graphql-kit';
import { Roles, RolesEnum } from '@pe/nest-kit';
import { ChannelSetService } from '../../services';
import { ChannelSetModel } from '../../models';

@Resolver('ChannelSet')
@UseGuards(GqlAuthGuard)
@Roles(RolesEnum.anonymous)
export class ChannelSetResolver extends AbstractGqlResolver {
  constructor(
    private readonly channelSetService: ChannelSetService,
  ) { super(); }

  @Query() public async getChannelSetByBusiness(
    @Args('businessId') businessId: string,
  ): Promise<ChannelSetModel[]> {

    return this.channelSetService.findByBusinessId(businessId);
  }
}
