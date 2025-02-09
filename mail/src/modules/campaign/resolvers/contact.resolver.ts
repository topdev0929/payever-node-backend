import { Logger, UseGuards } from '@nestjs/common';
import { Acl, AclActionsEnum, MessageBusService, Roles, RolesEnum } from '@pe/nest-kit';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CustomError, ErrorName } from '../../../common';
import { BusinessModel, BusinessService } from '../../business';
import { ContactClass } from '../classes';
import { ContactModel } from '../models';
import { ContactService } from '../services';
import { AbstractGqlResolver, GqlAuthGuard } from '@pe/graphql-kit';

@UseGuards(GqlAuthGuard)
@Resolver('Contact')
@Roles(RolesEnum.merchant)
export class ContactResolver extends AbstractGqlResolver {
  constructor(
    private readonly messageBusService: MessageBusService,
    private readonly logger: Logger,
    private readonly contactService: ContactService,
    private readonly businessService: BusinessService,
  ) {
    super();
  }

  @Query()
  @Acl({ microservice: 'marketing', action: AclActionsEnum.read })
  public async getContact(
    @Args('businessId') businessId: string,
    @Args('id') contactId: string,
  ): Promise<ContactModel> {
    const business: BusinessModel = await this.businessService.findOneById(businessId);
    this.isBusinessExist(business);

    return this.contactService.getContact(businessId);
  }

  @Mutation()
  @Acl({ microservice: 'marketing', action: AclActionsEnum.create })
  public async setContact(
    @Args('businessId') businessId: string,
    @Args('data') data: ContactClass,
  ): Promise<ContactModel> {
    const business: BusinessModel = await this.businessService.findOneById(businessId);
    this.isBusinessExist(business);

    return this.contactService.setContact(business, data);
  }

  private isBusinessExist(business: BusinessModel): void {
    if (!business) {
      throw new CustomError(ErrorName.IdsNotValid);
    }
  }
}
