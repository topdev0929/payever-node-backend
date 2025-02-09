import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScheduleRequestDto, ScheduleResponseDto } from '../dto';
import { ScheduleInterface } from '../interfaces';
import { classToPlain, plainToClass } from 'class-transformer';
import { RabbitEventsProducer } from '../../common';
import { ScheduleSchemaName } from '../../mongoose-schema';
import { ScheduleModel } from '../models';
import { DurationTypeEnum, TaskTypeEnum } from '../enum';
import { validate, ValidationError } from 'class-validator';
import * as moment from 'moment/moment';

@Injectable()
export class ScheduleService {
  private DEFAULT_LIMIT: number = 20;
  private CHUNK_SIZE: number = 50;
  constructor(
    @InjectModel(ScheduleSchemaName) private readonly scheduleModel: Model<ScheduleModel>,
    private readonly rabbitEventsProducer: RabbitEventsProducer,
    private readonly logger: Logger,
  ) { }

  public async runScheduledTasks(task: TaskTypeEnum): Promise<void> {
    let thereAreMore: boolean = true;
    let processed: number = 0;
    let done: number = 0;

    while (thereAreMore) {
      const schedules: ScheduleModel[] = await this.findEnabledTaskSchedules(task, this.CHUNK_SIZE, processed);

      for (const schedule of schedules) {
        if (!this.isValidToRun(schedule)) {
          continue;
        }

        await this.rabbitEventsProducer.sendScheduledTaskEvent(classToPlain(schedule));
        done++;
      }

      thereAreMore = schedules.length === this.CHUNK_SIZE;
      processed += schedules.length;
    }

    this.logger.log({
      context: 'ScheduleService',
      message: `Processed ${processed} Scheduled tasks, ${done} tasks sent to queue`,
    });
  }

  public async createSchedule(dto: ScheduleRequestDto, businessId: string): Promise<ScheduleResponseDto> {
    await this.validateScheduleDto(dto);

    const created: ScheduleModel = await this.scheduleModel.create(
      {
        action: dto.action,
        businessId,
        duration: {
          period: dto.duration?.period,
          type: dto.duration?.type,
          unit: dto.duration?.unit,
        },
        enabled: dto.enabled,
        filter: {
          dateGt: dto.filter?.date_gt,
          dateLt: dto.filter?.date_lt,
          specificStatus: dto.filter?.specific_status,
          status: dto.filter?.status,
          totalGt: dto.filter?.total_gt,
          totalLt: dto.filter?.total_lt,
        },
        payload: dto.payload,
        paymentId: dto.payment_id,
        paymentMethod: dto.payment_method,
        task: dto.task,

        endDate: dto.end_date,
        startDate: dto.start_date,
      },
    );

    return this.prepareScheduleResponse(created);
  }

  public async updateSchedule(schedule: ScheduleInterface, dto: ScheduleRequestDto): Promise<ScheduleResponseDto> {
    await this.validateScheduleDto(dto);

    const updateDto: ScheduleInterface = {
      action: dto.action,
      businessId: schedule.businessId,
      duration: {
        period: dto.duration?.period,
        type: dto.duration?.type,
        unit: dto.duration?.unit,
      },
      enabled: dto.enabled,
      filter: {
        dateGt: dto.filter?.date_gt,
        dateLt: dto.filter?.date_lt,
        specificStatus: dto.filter?.specific_status,
        status: dto.filter?.status,
        totalGt: dto.filter?.total_gt,
        totalLt: dto.filter?.total_lt,
      },
      payload: dto.payload,
      paymentId: dto.payment_id,
      paymentMethod: dto.payment_method,
      task: dto.task,

      endDate: dto.end_date,
      startDate: dto.start_date,
    };

    const updated: ScheduleModel = await this.scheduleModel.findOneAndUpdate(
      { _id: schedule._id },
      { $set: updateDto },
      { new: true},
    );

    return this.prepareScheduleResponse(updated);
  }

  public async getSchedulesList(
    businessId: string,
    offset: number = 0,
    limit: number = this.DEFAULT_LIMIT,
  ): Promise<ScheduleResponseDto[]> {
    const schedules: ScheduleModel[] = await this.scheduleModel
      .find({ businessId })
      .skip(offset)
      .limit(limit);

    return this.prepareScheduleResponseList(schedules);
  }

  public async getSchedule(schedule: ScheduleInterface): Promise<ScheduleResponseDto> {
    return this.prepareScheduleResponse(schedule);
  }

  public async removeSchedule(schedule: ScheduleInterface): Promise<void> {
    await this.scheduleModel.findOneAndDelete(
      { _id: schedule._id },
    );
  }

  public async enableSchedule(schedule: ScheduleInterface): Promise<ScheduleResponseDto> {
    const updated: ScheduleModel = await this.scheduleModel.findOneAndUpdate(
      { _id: schedule._id },
      { $set: { enabled: true }},
      { new: true },
    );

    return this.prepareScheduleResponse(updated);
  }

  public async disableSchedule(schedule: ScheduleInterface): Promise<ScheduleResponseDto> {
    const updated: ScheduleModel = await this.scheduleModel.findOneAndUpdate(
      { _id: schedule._id },
      { $set: { enabled: false }},
      { new: true },
    );

    return this.prepareScheduleResponse(updated);
  }

  public async updateLastRun(schedule: ScheduleInterface): Promise<void> {
    await this.scheduleModel.updateOne(
      { _id: schedule._id },
      { $set: { lastRun: new Date() } },
    );
  }

  public prepareScheduleResponse(schedule: ScheduleInterface): ScheduleResponseDto {
    return plainToClass<ScheduleResponseDto, { }>(ScheduleResponseDto, schedule);
  }

  public prepareScheduleResponseList(schedule: ScheduleInterface[]): ScheduleResponseDto[] {
    return plainToClass<ScheduleResponseDto, { }>(ScheduleResponseDto, schedule);
  }

  private async findEnabledTaskSchedules(task: TaskTypeEnum, limit: number, offset: number): Promise<ScheduleModel[]> {
    return this.scheduleModel
      .find({
        $and: [
          {
            $or: [
              { 'duration.type': { $ne: DurationTypeEnum.once }},
              { 'duration.type': DurationTypeEnum.once, lastRun: null },
            ],
          },
          {
            $or: [
              { 'startDate': { $exists: false }},
              { 'startDate': { $lt: new Date() }},
            ],
          },
          {
            $or: [
              { 'endDate': { $exists: false }},
              { 'endDate': { $gt: new Date() }},
            ],
          },
        ],
        enabled: true,
        task,
      })
      .skip(offset)
      .limit(limit);
  }

  private async validateScheduleDto(dto: ScheduleRequestDto): Promise<void> {
    const validationGroups: string[] = ['create'];
    if (dto?.task && [TaskTypeEnum.paymentLinkReminder, TaskTypeEnum.paymentAction].includes(dto.task)) {
      validationGroups.push(dto.task);
    }

    if (dto?.task && dto.task === TaskTypeEnum.paymentAction) {
      if (dto.payment_method) {
        validationGroups.push('payment_method');
      } else if (dto.payment_id) {
        validationGroups.push('payment_id');
      }
    }

    const validationErrors: ValidationError[] =
      await validate(dto, { groups: validationGroups, validationError: { target: false }});
    if (validationErrors && validationErrors.length) {
      throw new BadRequestException(validationErrors);
    }
  }

  private isValidToRun(schedule: ScheduleInterface): boolean {
    const dateToCheck: Date = moment(new Date(schedule.lastRun || schedule.startDate || schedule.createdAt))
        .add(schedule.duration.period, schedule.duration.unit)
        .toDate();

    return dateToCheck < new Date();
  }
}
