import { UseFilters, UseGuards, NotFoundException } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GqlAuthGuard } from '@pe/graphql-kit';
import {
  Roles,
  RolesEnum,
  Acl,
  AclActionsEnum,
  AccessTokenPayload,
  GqlUser,
} from '@pe/nest-kit';
import { BaseResolver, ListQueryDto, ServiceExceptionFilter } from '../../common';
import { CreateAppointmentTypeDto, TypePagingResultDto, UpdateAppointmentTypeDto } from '../dto';

import { AppointmentType, AppointmentTypeDocument } from '../schemas';
import { AppointmentTypeService } from '../services';

@Resolver(() => AppointmentType)
@UseFilters(ServiceExceptionFilter)
@UseGuards(GqlAuthGuard)
@Roles(RolesEnum.merchant)
export class AppointmentTypeResolver extends BaseResolver {
  constructor(
    private readonly appointmentTypeService: AppointmentTypeService,
  ) {
    super();
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.read })
  @Query(() => AppointmentType)
  public async appointmentType(
    @Args('id') _id: string,
    @Args('businessId') businessId: string,
  ): Promise<AppointmentType> {
    const appointmentType: AppointmentType = await this.appointmentTypeService.findOne({
      _id,
      businessId,
    });
    if (!appointmentType) {
      throw new NotFoundException();
    }

    return appointmentType;
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.read })
  @Query(() => TypePagingResultDto)
  public async appointmentTypes(
    @Args('businessId') businessId: string,
    @Args('listQuery') listQueryDto: ListQueryDto,
  ): Promise<TypePagingResultDto> {

    return this.appointmentTypeService.search(listQueryDto, businessId);
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.read })
  @Query(() => AppointmentType)
  public async getDefaultAppointmentType(
    @Args('businessId') businessId: string,
  ): Promise<AppointmentType> {
    return this.appointmentTypeService.findOne({
      businessId,
      isDefault: true,
    });
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.create })
  @Mutation(() => AppointmentType)
  public async createAppointmentType(
    @Args('businessId') businessId: string,
    @Args('data') data: CreateAppointmentTypeDto,
    @GqlUser() user: AccessTokenPayload,
  ): Promise<AppointmentType> {

    if (data.isDefault) {
      await this.appointmentTypeService.updateOneByFilter({
        businessId,
        isDefault: true,
      }, { isDefault: false });
    }

    return this.appointmentTypeService.create(
       {
      ...data,
      businessId,
    });
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.update })
  @Mutation(() => AppointmentType)
  public async updateAppointmentType(
    @Args('id') _id: string,
    @Args('businessId') businessId: string,
    @Args('data') data: UpdateAppointmentTypeDto,
  ): Promise<AppointmentType> {

    if (data.isDefault) {
      await this.appointmentTypeService.updateOneByFilter({
        businessId,
        isDefault: true,
      }, { isDefault: false });
    }

    return this.appointmentTypeService.updateOneByFilter({
      _id,
      businessId,
    }, data);
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.update })
  @Mutation(() => AppointmentType)
  public async setDefaultAppointmentType(
    @Args('id') _id: string,
    @Args('businessId') businessId: string,
  ): Promise<AppointmentType> {

    const appointmentType: AppointmentTypeDocument = await this.appointmentTypeService.findOne({
      _id,
      businessId,
    });

    if (!appointmentType) {
      throw new NotFoundException();
    }

    await this.appointmentTypeService.updateOneByFilter({
      businessId,
      isDefault: true,
    }, { isDefault: false });

    return this.appointmentTypeService.updateOneByFilter({
      _id,
      businessId,
    }, { isDefault: true });
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.delete })
  @Mutation(() => [String])
  public async deleteAppointmentType(
    @Args('id') _id: string,
    @Args('businessId') businessId: string,
  ): Promise<string[]> {
    const appointmentType: AppointmentTypeDocument = await this.appointmentTypeService.findOne({
      _id,
      businessId,
    });

    if (!appointmentType) {
      throw new NotFoundException();
    }

    await this.appointmentTypeService.removeById(appointmentType._id);

    return [_id];
  }
}
