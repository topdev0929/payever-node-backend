import { UseFilters, UseGuards, NotFoundException } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { GqlAuthGuard } from '@pe/graphql-kit';
import {
  AccessTokenPayload,
  Roles,
  RolesEnum,
  GqlUser,
  Acl,
  AclActionsEnum,
} from '@pe/nest-kit';
import * as uuid from 'uuid';

import { ServiceExceptionFilter } from '../../../common/service.exception.filter';
import { AppointmentService } from '../../services';
import {
  CreateAppointmentDto,
  UpdateAppointmentDtoAppointmentDto,
  AppointmentFilterDto,
} from '../../dto';
import { AppointmentModelService } from '../../models-services';
import { Appointment, AppointmentDocument, AppointmentField } from '../../schemas';
import { BaseResolver } from '../../../common/base.resolver';
import { ElasticExtraData } from '../../interfaces';

@Resolver(() => Appointment)
@UseFilters(ServiceExceptionFilter)
@UseGuards(GqlAuthGuard)
@Roles(RolesEnum.merchant)
export class AppointmentResolver extends BaseResolver {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly appointmentModelService: AppointmentModelService,
  ) {
    super();
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.read })
  @Query(() => Appointment)
  public async appointment(
    @Args('id') _id: string,
    @Args('businessId') businessId: string,
  ): Promise<Appointment> {
    const appointment: AppointmentDocument = await this.appointmentModelService.findOne({
      _id,
      businessId,
    });
    if (!appointment) {
      throw new NotFoundException();
    }

    return appointment;
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.read })
  @Query(() => [Appointment])
  public async appointments(
    @Args('businessId') businessId: string,
    @Args('first', {
      nullable: true,
    }) first: number,
    @Args('offset', {
      nullable: true,
    }) offset: number,
    @Args('filter', {
      nullable: true,
    }) filterArg: AppointmentFilterDto = { },
    @GqlUser() user: AccessTokenPayload,
  ): Promise<Appointment[]> {

    return this.appointmentModelService.find({
      $and: [
        filterArg,
        { businessId },
      ],
    }).skip(offset).limit(first);
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.create })
  @Mutation(() => Appointment)
  public async createAppointment(
    @Args('businessId') businessId: string,
    @Args('data') data: CreateAppointmentDto,
    @GqlUser() user: AccessTokenPayload,
    @Args('targetFolderId', { nullable: true }) targetFolderId?: string,
  ): Promise<Appointment> {

    const extraData: ElasticExtraData = {
      elasticIds: { 
        applicationScopeId: uuid.v4(),
        businessScopeId: uuid.v4(),
      },
      targetFolderId: targetFolderId,
    };

    const appointment: AppointmentDocument = await this.appointmentService.create(
      {
      ...data,
      businessId,
    }, extraData);

    return {
      ...appointment.toObject(),
      applicationScopeElasticId: extraData.elasticIds.applicationScopeId,
      businessScopeElasticId: extraData.elasticIds.businessScopeId,
    };
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.update })
  @Mutation(() => Appointment)
  public async updateAppointment(
    @Args('id') _id: string,
    @Args('businessId') businessId: string,
    @Args('data') data: UpdateAppointmentDtoAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.updateOneByFilter({
      _id,
      businessId,
    }, data);
  }

  @Acl({ microservice: 'appointments', action: AclActionsEnum.delete })
  @Mutation(() => [String])
  public async deleteAppointment(
    @Args('id') _id: string,
    @Args('businessId') businessId: string,
  ): Promise<string[]> {
    const appointment: AppointmentDocument = await this.appointmentModelService.findOne({
      _id,
      businessId,
    });

    await this.appointmentService.delete(appointment);

    return [_id];
  }

  @ResolveField()
  public async fields(
    @Parent() appointment: AppointmentDocument,
  ): Promise<AppointmentField[]> {
    await appointment
      .populate('fields')
      .execPopulate();

    return appointment.fields;
  }
}
