import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { CampaignSchemaName, ScheduleSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { ScheduleInputClass } from '../classes';
import { AdminCreateScheduleDto, AdminScheduleListDto } from '../dto';
import { CampaignModel, ScheduleModel } from '../models';
import { ScheduleService } from '../services';

const SCHEDULE_PLACEHOLDER: string = ':scheduleId';
const CAMPAIGN_PLACEHOLDER: string = ':campaignId';

@Controller('admin/schedule')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiBearerAuth()
@ApiTags('admin')
export class AdminScheduleController {
  constructor(
    private scheduleService: ScheduleService,
  ) { }

  @Get(SCHEDULE_PLACEHOLDER)
  public async getOne(
    @ParamModel({ '_id': SCHEDULE_PLACEHOLDER }, ScheduleSchemaName) schedule: ScheduleModel,
  ): Promise<ScheduleModel> {

    return schedule;
  }

  @Get('list')
  public async getMany(
    @Query(new ValidationPipe({ transform: true })) dto: AdminScheduleListDto,
  ): Promise<any[]> {

    return this.scheduleService.retrieveListForAdmin(dto);
  }

  @Post(CAMPAIGN_PLACEHOLDER)
  public async create(
    @Body() dto: AdminCreateScheduleDto,
    @ParamModel({ '_id': CAMPAIGN_PLACEHOLDER }, CampaignSchemaName) campaign: CampaignModel,
  ): Promise<ScheduleModel> {

    return this.scheduleService.updateOrInsert(campaign.id, dto as ScheduleInputClass);
  }

  @Patch(SCHEDULE_PLACEHOLDER)
  public async update(
    @ParamModel({ '_id': SCHEDULE_PLACEHOLDER }, ScheduleSchemaName) schedule: ScheduleModel,
    @Body() dto: Partial<AdminCreateScheduleDto>,
  ): Promise<ScheduleModel> {

    return this.scheduleService.updateOrInsert(schedule.campaign, dto as ScheduleInputClass);
  }

  @Delete(SCHEDULE_PLACEHOLDER)
  public async delete(
    @ParamModel({ '_id': SCHEDULE_PLACEHOLDER }, ScheduleSchemaName) schedule: ScheduleModel,
  ): Promise<ScheduleModel> {

    return this.scheduleService.delete(schedule);
  }
}
