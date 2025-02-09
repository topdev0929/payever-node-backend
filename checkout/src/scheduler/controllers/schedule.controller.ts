import {
  Body,
  Controller,
  Post,
  Put,
  Patch,
  Delete,
  UseGuards,
  Get,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenPayload, JwtAuthGuard, ParamModel, Roles, RolesEnum, User } from '@pe/nest-kit';
import { OauthService } from '../../common/services';
import { ApiBody } from '@nestjs/swagger/dist/decorators/api-body.decorator';
import { ScheduleRequestDto, ScheduleResponseDto } from '../dto';
import { ScheduleService } from '../services';
import { ScheduleSchemaName } from '../../mongoose-schema';
import { ScheduleModel } from '../models';
import { plainToClass } from 'class-transformer';

const SCHEDULE_ID_PLACEHOLDER: string = ':scheduleId';

@Controller('schedule')
@ApiTags('schedule')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(
    private readonly oauthService: OauthService,
    private readonly scheduleService: ScheduleService,
  ) { }

  @Post('')
  @Roles(RolesEnum.oauth)
  @ApiBody({ type: ScheduleRequestDto })
  public async createSchedule(
    @User() user: AccessTokenPayload,
    @Body() dto: any,
  ): Promise<ScheduleResponseDto> {
    const businessId: string = this.oauthService.getOauthUserBusiness(user);

    const scheduleDto: ScheduleRequestDto = plainToClass(ScheduleRequestDto, dto);

    return this.scheduleService.createSchedule(scheduleDto, businessId);
  }

  @Put(`${SCHEDULE_ID_PLACEHOLDER}`)
  @Roles(RolesEnum.oauth)
  @ApiBody({ type: ScheduleRequestDto })
  public async editSchedule(
    @ParamModel(`${SCHEDULE_ID_PLACEHOLDER}`, ScheduleSchemaName) scheduleModel: ScheduleModel,
    @User() user: AccessTokenPayload,
    @Body() dto: any,
  ): Promise<ScheduleResponseDto> {
    const businessId: string = this.oauthService.getOauthUserBusiness(user);
    if (scheduleModel.businessId !== businessId) {
      throw new ForbiddenException('You are not allowed to update schedule');
    }

    const scheduleDto: ScheduleRequestDto = plainToClass(ScheduleRequestDto, dto);

    return this.scheduleService.updateSchedule(scheduleModel, scheduleDto);
  }

  @Get(`${SCHEDULE_ID_PLACEHOLDER}`)
  @Roles(RolesEnum.oauth)
  public async getSchedule(
    @ParamModel(`${SCHEDULE_ID_PLACEHOLDER}`, ScheduleSchemaName) scheduleModel: ScheduleModel,
    @User() user: AccessTokenPayload,
  ): Promise<ScheduleResponseDto> {
    const businessId: string = this.oauthService.getOauthUserBusiness(user);
    if (scheduleModel.businessId !== businessId) {
      throw new ForbiddenException('You are not allowed to get schedule');
    }

    return this.scheduleService.getSchedule(scheduleModel);
  }

  @Get('')
  @Roles(RolesEnum.oauth)
  public async getSchedulesList(
    @User() user: AccessTokenPayload,
    @Query('offset') offset: number,
  ): Promise<ScheduleResponseDto[]> {
    const businessId: string = this.oauthService.getOauthUserBusiness(user);

    return this.scheduleService.getSchedulesList(businessId, offset);
  }

  @Patch(`${SCHEDULE_ID_PLACEHOLDER}/enable`)
  @Roles(RolesEnum.oauth)
  public async enableSchedule(
    @ParamModel(`${SCHEDULE_ID_PLACEHOLDER}`, ScheduleSchemaName) scheduleModel: ScheduleModel,
    @User() user: AccessTokenPayload,
  ): Promise<ScheduleResponseDto> {
    const businessId: string = this.oauthService.getOauthUserBusiness(user);
    if (scheduleModel.businessId !== businessId) {
      throw new ForbiddenException('You are not allowed to enable schedule');
    }

    return this.scheduleService.enableSchedule(scheduleModel);
  }

  @Patch(`${SCHEDULE_ID_PLACEHOLDER}/disable`)
  @Roles(RolesEnum.oauth)
  public async disableSchedule(
    @ParamModel(`${SCHEDULE_ID_PLACEHOLDER}`, ScheduleSchemaName) scheduleModel: ScheduleModel,
    @User() user: AccessTokenPayload,
  ): Promise<ScheduleResponseDto> {
    const businessId: string = this.oauthService.getOauthUserBusiness(user);
    if (scheduleModel.businessId !== businessId) {
      throw new ForbiddenException('You are not allowed to disable schedule');
    }

    return this.scheduleService.disableSchedule(scheduleModel);
  }

  @Delete(`${SCHEDULE_ID_PLACEHOLDER}`)
  @Roles(RolesEnum.oauth)
  public async removeSchedule(
    @ParamModel(`${SCHEDULE_ID_PLACEHOLDER}`, ScheduleSchemaName) scheduleModel: ScheduleModel,
    @User() user: AccessTokenPayload,
  ): Promise<void> {
    const businessId: string = this.oauthService.getOauthUserBusiness(user);
    if (scheduleModel.businessId !== businessId) {
      throw new ForbiddenException('You are not allowed to delete schedule');
    }

    await this.scheduleService.removeSchedule(scheduleModel);
  }
}
