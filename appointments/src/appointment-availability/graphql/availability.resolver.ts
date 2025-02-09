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
import { AppointmentDocument } from '../../appointments/schemas';
import { BaseResolver, ServiceExceptionFilter, ListQueryDto } from '../../common';
import { 
  CreateAppointmentAvailabilityDto, 
  AvailabilityPagingResultDto, 
  UpdateAppointmentAvailabilityDto, 
} from '../dto';

import { AppointmentAvailability, AppointmentAvailabilityDocument } from '../schemas';
import { AppointmentAvailabilityService } from '../services';

@Resolver(() => AppointmentAvailability)
@UseFilters(ServiceExceptionFilter)
@UseGuards(GqlAuthGuard)
@Roles(RolesEnum.merchant)
export class AppointmentAvailabilityResolver extends BaseResolver {
  constructor(
    private readonly appointmentAvailabilityService: AppointmentAvailabilityService,
  ) {
    super();
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.read })
  @Query(() => AppointmentAvailability)
  public async appointmentAvailability(
    @Args('id') _id: string,
    @Args('businessId') businessId: string,
  ): Promise<AppointmentAvailability> {
    const appointmentAvailability: AppointmentAvailability = await this.appointmentAvailabilityService.findOne({
      _id,
      businessId,
    });
    if (!appointmentAvailability) {
      throw new NotFoundException();
    }

    return appointmentAvailability;
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.read })
  @Query(() => AvailabilityPagingResultDto)
  public async appointmentAvailabilities(
    @Args('businessId') businessId: string,
    @Args('listQuery') listQueryDto: ListQueryDto,
  ): Promise<AvailabilityPagingResultDto> {

    return this.appointmentAvailabilityService.search(listQueryDto, businessId);
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.read })
  @Query(() => AppointmentAvailability)
  public async getDefaultAppointmentAvailability(
    @Args('businessId') businessId: string,
  ): Promise<AppointmentAvailability> {
    return this.appointmentAvailabilityService.findOne({
      businessId,
      isDefault: true,
    });
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.create })
  @Mutation(() => AppointmentAvailability)
  public async createAppointmentAvailability(
    @Args('businessId') businessId: string,
    @Args('data') data: CreateAppointmentAvailabilityDto,
    @GqlUser() user: AccessTokenPayload,
  ): Promise<AppointmentAvailability> {
    const appointmentAvailability: AppointmentAvailability = 
    await this.appointmentAvailabilityService.create(
       {
      ...data,
      businessId,
    });

    await this.appointmentAvailabilityService.setDefault(businessId, appointmentAvailability._id);

    return appointmentAvailability;
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.update })
  @Mutation(() => AppointmentAvailability)
  public async updateAppointmentAvailability(
    @Args('id') _id: string,
    @Args('businessId') businessId: string,
    @Args('data') data: UpdateAppointmentAvailabilityDto,
  ): Promise<AppointmentAvailability> {

    await this.appointmentAvailabilityService.setDefault(
      businessId,
      data.isDefault ? _id : null,
    );

    return this.appointmentAvailabilityService.updateOneByFilter({
      _id,
      businessId,
    }, data);
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.update })
  @Mutation(() => AppointmentAvailability)
  public async setDefaultAppointmentAvailability(
    @Args('id') _id: string,
    @Args('businessId') businessId: string,
  ): Promise<AppointmentAvailability> {

    const appointmentAvailability: AppointmentAvailabilityDocument = await this.appointmentAvailabilityService.findOne({
      _id,
      businessId,
    });

    if (!appointmentAvailability) {
      throw new NotFoundException();
    }

    await this.appointmentAvailabilityService.setDefault(businessId, _id);

    return this.appointmentAvailabilityService.findById(_id);
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.delete })
  @Mutation(() => [String])
  public async deleteAppointmentAvailability(
    @Args('id') _id: string,
    @Args('businessId') businessId: string,
  ): Promise<string[]> {
    const appointmentAvailability: AppointmentAvailabilityDocument = await this.appointmentAvailabilityService.findOne({
      _id,
      businessId,
    });

    if (!appointmentAvailability) {
      throw new NotFoundException();
    }

    await this.appointmentAvailabilityService.removeById(appointmentAvailability._id);

    return [_id];
  }
}
