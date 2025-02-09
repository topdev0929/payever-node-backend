import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateWidgetDto, UpdateWidgetSettingDto } from '../dto';
import { WidgetSchemaName, WidgetPropsSchemaName } from '../schemas';
import { WidgetSettingInterface, WidgetPropsInterface } from '../interfaces';
import { WidgetSettingTypeEnum, WidgetTypeEnum } from '../enums';
import * as jwt from 'jsonwebtoken';
import cubejs from '@cubejs-client/core';
import { environment } from '../../environments';
import { WidgetModel } from '../models/widget.model';
import { DashboardModel } from '../models/dashboard.model';
import { BusinessModel } from '../models/business.model';
import { WidgetPropsModel } from '../models/widget-props.model';


@Injectable()
export class WidgetService {
  constructor(
    @InjectModel(WidgetSchemaName)
    private readonly widgetModel: Model<WidgetModel>,
    @InjectModel(WidgetPropsSchemaName)
    private readonly widgetPropsModel: Model<WidgetPropsModel>,
  ) {
  }

  public async getWidgetData(business: BusinessModel, widgetType: WidgetTypeEnum): Promise<any> {
    const allWidgets: WidgetPropsInterface[] = await this.widgetPropsModel.find();
    const currentWidget: WidgetPropsInterface = allWidgets
      .find((widget: WidgetPropsInterface) => widget.widgetType === widgetType);

    if (!currentWidget) {
      throw new NotFoundException('Widget does not exist.');
    }
    const results: any = { };

    for (const prop of currentWidget.props) {
      const query: any = this.replaceBusinessId(prop.query, business);
      let data: any;
      
      try {
        data = await cubejs(
          jwt.sign({ }, environment.cubejs.apiSecret, {
            expiresIn: '180d',
          }),
          { apiUrl: `${ environment.cubejs.host }/cubejs-api/v1` },
        ).load(query);
      } catch (err) {
        throw new InternalServerErrorException('cube query failed: ' + err.message);
      }
      const result: any = new Set();

      if (data?.loadResponse?.results[0]?.data) {
        for (const obj of data?.loadResponse?.results[0]?.data) {
          const keys: string[] = Object.keys(obj);
          if (keys.length > 0) {
            result.add(obj[keys[0]]);
          }
        }
      }

      results[prop.name] = Array.from(result);
    }

    return results;
  }

  public async create(dashboard: DashboardModel, dto: any): Promise<WidgetModel> {
    const widget: WidgetModel = await this.widgetModel.create({
      dashboard: dashboard._id,
      name: dto.name,
      size: dto.size,
      type: dto.type,
      viewType: dto.viewType,
      widgetSettings: dto.widgetSettings,
    });

    return this.widgetModel.findById(widget._id).populate('dashboard').exec();
  }

  public async findOneById(widgetId: string): Promise<WidgetModel> {
    return this.widgetModel.findById(widgetId).populate('dashboard').exec();
  }

  public async findAll(dashboard: DashboardModel): Promise<WidgetModel[]> {
    return this.widgetModel
      .find({ dashboard: dashboard._id })
      .sort({ title: 1 })
      .populate('dashboard')
      .exec();
  }

  public async remove(widget: WidgetModel): Promise<void> {
    await this.widgetModel.deleteOne({ _id: widget.id }).exec();
  }

  public async update(widget: WidgetModel, dto: UpdateWidgetDto): Promise<WidgetModel> {
    const updatedData: any = { };
    Object.keys(dto).forEach((key: string) => {
      updatedData[`${ key }`] = dto[key];
    });

    await this.widgetModel.updateOne(
      { _id: widget.id },
      { $set: updatedData },
    ).exec();

    return this.widgetModel.findById(widget.id).populate('dashboard').exec();
  }

  public async updateWidgetSettings(widget: WidgetModel, dto: UpdateWidgetSettingDto): Promise<WidgetModel> {
    await this.widgetModel.updateOne(
      { _id: widget.id },
      { $set: { widgetSettings: dto.widgetSettings } as any },
    ).exec();

    return this.widgetModel.findById(widget.id).populate('dashboard').exec();
  }

  public resolveSetting(widgetSettings: WidgetSettingInterface[], settingType: WidgetSettingTypeEnum): any {
    return (widgetSettings.find((setting: WidgetSettingInterface) => setting.type === settingType) || { }).value;
  }

  public resolveSettings(
    widgetSettings: WidgetSettingInterface[],
    settingType: WidgetSettingTypeEnum,
    field: string = 'value',
  ): any {
    return widgetSettings
      .filter((setting: WidgetSettingInterface) => setting.type === settingType)
      .map((setting: WidgetSettingInterface) => setting[field]);
  }

  private replaceBusinessId(query: any, business: BusinessModel): any {
    return JSON.parse(JSON.stringify(query).replace('<BUSINESS_ID>', business._id));
  }
}
