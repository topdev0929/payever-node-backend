import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScheduleInputClass } from '../classes';
import { AdminScheduleListDto } from '../dto';
import { ScheduleStatusEnum, ScheduleTypeEnum } from '../enums';
import { ScheduleInterface } from '../interfaces';
import { CampaignModel, ScheduleModel } from '../models';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel('Schedule') private scheduleModel: Model<ScheduleModel>,
  ) {
  }

  public async findAndUpdateSchedules(campaign: CampaignModel, schedules: ScheduleInputClass[]): Promise<string[]> {
    if (!schedules) {
      return [];
    }

    const result: string[] = [];
    for (const schedule of schedules) {
      const saved: ScheduleModel = await this.updateOrInsert(campaign.id, schedule);
      result.push(saved.id);
    }

    return result;
  }

  public async updateOrInsert(campaignId: string, schedule: ScheduleInputClass): Promise<ScheduleModel> {
    const set: ScheduleInterface = {
      campaign: campaignId,
      date: schedule.date,
      interval: schedule.interval,
      recurring: schedule.recurring,
      type: schedule.type,
    };

    return this.scheduleModel.findOneAndUpdate(
      {
        campaign: campaignId,
        date: schedule.date,
        interval: schedule.interval,
        'recurring.target': schedule.recurring?.target,
        type: schedule.type,
      },
      {
        $set: set,
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async deleteScheduleExceptIds(campaign: CampaignModel, ids: string[]): Promise<void> {
    await this.scheduleModel.deleteMany({
      _id: {
        $nin: ids,
      },
      campaign: campaign.id,
    });
  }

  public async getActiveSchedule(): Promise<ScheduleModel[]> {
    return this.scheduleModel.find(
      {
        $and: [
          {
            $or: [
              {
                date: { $lte: new Date() },
              },
              {
                type: ScheduleTypeEnum.Now,
              },
            ],
          },
          {
            $or: [
              { status: ScheduleStatusEnum.Active },
              { status: null },
              { status: { $exists: false } },
            ],
          },
          {
            $or: [
              { failCount: { $lte: 5 } },
              { failCount: null },
            ],
          },
        ],
      },
    ).populate('campaign');
  }

  public async setFailCount(scheduleId: string, error: string = ''): Promise<void> {
    await this.scheduleModel.updateOne(
      {
        _id: scheduleId,
      },
      {
        $inc: {
          failCount: 1,
        },
        $push: {
          cronErrors: error,
        },
      },
    );
  }

  public async setToDraft(scheduleId: string): Promise<void> {
    await this.scheduleModel.updateOne(
      {
        _id: scheduleId,
      },
      {
        $set: {
          status: ScheduleStatusEnum.Draft,
        },
      },
    );
  }

  public async findById(scheduleId: string): Promise<ScheduleModel> {
    return this.scheduleModel.findById(scheduleId);
  }

  public async retrieveListForAdmin(query: AdminScheduleListDto): Promise<any> {
    const limit: number = query.limit * 1 || 100;
    const page: number = query.page * 1 || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.campaignIds) {
      conditions.campaign = { $in: query.campaignIds };
    }

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    const schedules: ScheduleModel[] = await this.scheduleModel
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const total: number = await this.scheduleModel.count();

    return {
      page,
      schedules,
      total,
    };
  }

  public async delete(schedule: ScheduleModel): Promise<ScheduleModel> {
    return schedule.delete();
  }
}
