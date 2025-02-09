import { omitBy } from 'lodash';
import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  Roles,
  RolesEnum,
  ParamModel,
  JwtAuthGuard,
} from '@pe/nest-kit';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import {
  IntegrationModel,
  IntegrationSchemaName,
  SynchronizationTaskDto,
  TasksFilterDto,
  SyncEventInterface,
} from '@pe/synchronizer-kit';

import { TasksFilterPipe } from './tasks-filter.pipe';
import {
  SynchronizationTaskService,
  SynchronizationTaskModel,
  SynchronizationTaskSchemaName,
  SynchronizationTaskInterface,
} from '../../synchronizer';
import { BUSINESS_ID_PLACEHOLDER_C } from './const';
import { ControllerHandlerService } from '../services';

@ApiTags('synchronization')
@ApiBearerAuth()

@Controller(`synchronization/business/${BUSINESS_ID_PLACEHOLDER_C}`)
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class SynchronizationTasksHttpController {
  constructor(
    private readonly controllerHandlerService: ControllerHandlerService,
    private readonly synchronizationTaskService: SynchronizationTaskService,
  ) { }

  @Get('/tasks/:taskId')
  public async getOne(
    @Param('businessId') swagger_businessId: string,
    @ParamModel({
      _id: ':taskId',
      businessId: BUSINESS_ID_PLACEHOLDER_C,
    }, SynchronizationTaskSchemaName, true) task: SynchronizationTaskModel,
    @Param('taskId') swagger_taskId: string,
  ): Promise<SynchronizationTaskModel> {
    return task;
  }

  @Get('/tasks')
  public async getAllByBusiness(
    @Param('businessId') businessId: string,
    @Query(TasksFilterPipe) filter: TasksFilterDto,
  ): Promise<SynchronizationTaskModel[]> {
    return this.synchronizationTaskService.find(omitBy({
      businessId: businessId,
      direction: filter.direction,
      status: filter.status ? { $in: filter.status } : undefined,
      kind: filter.kind ? { $in: filter.kind } : undefined,
    }, (value: string) => typeof value === 'undefined')).sort({ startedAt: -1 });
  }

  @Get('/tasks/by-integration/:integrationId')
  public async getByIntegration(
    @ParamModel(BUSINESS_ID_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param('businessId') swagger_businessId: string,
    @ParamModel(':integrationId', IntegrationSchemaName) integration: IntegrationModel,
    @Param('integrationId') swagger_integrationId: string,
  ): Promise<SynchronizationTaskModel[]> {
    return this.synchronizationTaskService.find({
      businessId: business._id,
      integrationId: integration._id,
    }).sort({ startedAt: -1 });
  }

  @Get('/tasks/:id/events')
  public async getLogs(
    @ParamModel(BUSINESS_ID_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param('businessId') swagger_businessId: string,
    @ParamModel(':id', SynchronizationTaskSchemaName) task: SynchronizationTaskModel,
    @Param('id') swagger_taskId: string,
  ): Promise<SyncEventInterface[]> {
    return (await this.synchronizationTaskService.findOne({
      _id: task._id,
      businessId: business._id,
    }).select('events'))?.events || [];
  }

  @Put('/tasks')
  public async createAndTrigger(
    @ParamModel(BUSINESS_ID_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param('businessId') swagger_businessId: string,
    @Body() dto: SynchronizationTaskDto,
  ): Promise<SynchronizationTaskInterface> {
    return this.controllerHandlerService.handleCreateTask(
      business._id,
      dto.fileImport,
      {
        parentFolderId: dto.parentFolderId,
      },
    );
  }
}
