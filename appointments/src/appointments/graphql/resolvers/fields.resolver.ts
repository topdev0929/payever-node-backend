import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AbstractGqlResolver, GqlAuthGuard } from '@pe/graphql-kit';
import { Roles, RolesEnum, Acl, AclActionsEnum } from '@pe/nest-kit';

import { ServiceExceptionFilter } from '../../../common/service.exception.filter';
import { CreateFieldDtoFieldDto, UpdateFieldDtoFieldDto } from '../../dto';
import { FieldService } from '../../services';
import { Field } from '../../schemas';
import { FieldModelService } from '../../models-services';

@Resolver(() => Field)
@UseFilters(ServiceExceptionFilter)
// @UseGuards(GqlAuthGuard)
// @Roles(RolesEnum.merchant)
export class FieldsResolver extends AbstractGqlResolver {
  constructor(
    private readonly fieldService: FieldService,
    private readonly fieldModelService: FieldModelService,
  ) {
    super();
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.read })
  @Query(() => [Field])
  public async fields(
    @Args('businessId') businessId: string,
    @Args('appointmentId', { nullable: true }) appointmentId?: string,
  ): Promise<Field[]> {
    return this.fieldService.findForBusiness(businessId, appointmentId);
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.create })
  @Mutation(() => Field)
  public async createField(
    @Args('businessId') businessId: string,
    @Args('data') data: CreateFieldDtoFieldDto,
    @Args('appointmentId', { nullable: true }) appointmentId?: string,
  ): Promise<Field> {
    return this.fieldService.createFromDto({
      ...data,
      appointmentId,
      businessId,
    });
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.update })
  @Mutation(() => Field)
  public async updateField(
    @Args('id') _id: string,
    @Args('businessId') businessId: string,
    @Args('data') data: UpdateFieldDtoFieldDto,
  ): Promise<Field> {
    return this.fieldModelService.updateOneByFilter({ _id, businessId }, data);
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.delete })
  @Mutation(() => [String])
  public async deleteField(
    @Args('id') _id: string,
    @Args('businessId') businessId: string,
  ): Promise<string[]> {
    return this.fieldModelService.removeByFilter({ _id, businessId });
  }
}
