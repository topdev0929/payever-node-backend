import {
  Body,
  Controller,
  Get,
  Put,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, ParamModel, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessSchemaName } from '@pe/business-kit';
import { BusinessModel } from '../../business/models';
import { ScheduleSchemaName } from '../schemas';
import {
  SettlementReportScheduleService,
} from '../services';
import { ScheduleModel } from '../models/schedule.model';
import { SettlementReportScheduleDto } from '../dto/export/settlement-report-schedule.dto';

const BUSINESS_ID: string = ':businessId';
const SCHEDULE_ID: string = ':scheduleId';

@Controller(`schedule-settlement/${BUSINESS_ID}`)
@ApiTags('schedule')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class ScheduleSettlementReportController {
  constructor(
    private readonly scheduleService: SettlementReportScheduleService,
  ) {
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async getSchedules(
    @ParamModel({ _id: BUSINESS_ID }, BusinessSchemaName, true) business: BusinessModel,
    @Query('skip') skip: number,
    @Query('limit') limit: number,
  ): Promise<ScheduleModel[]> {

    return this.scheduleService.getSchedules(business._id, skip, limit);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.create })
  public async CreateSchedule(
    @ParamModel({ _id: BUSINESS_ID }, BusinessSchemaName, true) business: BusinessModel,
    @Body() dto: SettlementReportScheduleDto,
  ): Promise<ScheduleModel> {
    dto.businessId = business._id;

    return this.scheduleService.createSchedule(dto);
  }

  @Put(SCHEDULE_ID)
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.update })
  public async updateSchedule(
    @ParamModel({ _id: BUSINESS_ID }, BusinessSchemaName, true) business: BusinessModel,
    @Body() dto: SettlementReportScheduleDto,
    @ParamModel({ _id: SCHEDULE_ID }, ScheduleSchemaName, true) schedule: ScheduleModel,
  ): Promise<ScheduleModel> {
    dto.businessId = business._id;

    return this.scheduleService.updateSchedule(schedule, dto);
  }

  @Patch(`/${SCHEDULE_ID}/enable`)
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.update })
  public async enableSchedule(
    @ParamModel({ _id: BUSINESS_ID }, BusinessSchemaName, true) _: BusinessModel,
    @ParamModel({ _id: SCHEDULE_ID }, ScheduleSchemaName, true) schedule: ScheduleModel,
  ): Promise<void> {
    await this.scheduleService.enableSchedule(schedule);
  }

  @Patch(`/${SCHEDULE_ID}/disable`)
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.update })
  public async disableSchedule(
    @ParamModel({ _id: BUSINESS_ID }, BusinessSchemaName, true) _: BusinessModel,
    @ParamModel({ _id: SCHEDULE_ID }, ScheduleSchemaName, true) schedule: ScheduleModel,
  ): Promise<void> {
    await this.scheduleService.disableSchedule(schedule);
  }

  @Get(SCHEDULE_ID)
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async getSchedule(
    @ParamModel({ _id: BUSINESS_ID }, BusinessSchemaName, true) _: BusinessModel,
    @ParamModel({ _id: SCHEDULE_ID }, ScheduleSchemaName, true) schedule: ScheduleModel,
  ): Promise<ScheduleModel> {

    return schedule;
  }

  @Delete(SCHEDULE_ID)
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.delete })
  public async deleteSchedule(
    @ParamModel({ _id: BUSINESS_ID }, BusinessSchemaName, true) _: BusinessModel,
    @ParamModel({ _id: SCHEDULE_ID }, ScheduleSchemaName, true) schedule: ScheduleModel,
  ): Promise<ScheduleModel> {

    return schedule.remove();
  }

}
