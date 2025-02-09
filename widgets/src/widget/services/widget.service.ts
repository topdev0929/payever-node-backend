import { Global, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWidgetDto, UpdateWidgetDto } from '../dto';
import { WidgetInterface } from '../interfaces';
import { WidgetModel } from '../models';

@Global()
@Injectable()
export class WidgetService {

  constructor(
    @InjectModel('Widget') private readonly widgetModel: Model<WidgetModel>,
  ) { }

  public async create(createWidgetDto: CreateWidgetDto): Promise<WidgetModel> {
    const widgetDto: WidgetInterface = {
      ...createWidgetDto,
    };

    const createdWidget: WidgetModel = await this.widgetModel.create(widgetDto);

    return this.widgetModel.findById(createdWidget._id);
  }

  public async findOneById(widgetId: string): Promise<WidgetModel> {
    return this.widgetModel.findById(widgetId);
  }

  public async findOneByType(widgetType: string): Promise<WidgetModel> {
    return this.widgetModel.findOne({ type: widgetType });
  }

  public async findAll(): Promise<WidgetModel[]> {
    return this.widgetModel.find({ }).sort({ title: 1 });
  }

  public async remove(widget: WidgetModel): Promise<void> {
    await this.widgetModel.deleteOne({ _id: widget.id }).exec();
  }

  public async update(widget: WidgetModel, data: UpdateWidgetDto): Promise<WidgetModel> {
    const updatedData: any = { };
    Object.keys(data).forEach((key: string) => {
      updatedData[`${key}`] = data[key];
    });

    await this.widgetModel.updateOne(
      { _id: widget.id },
      { $set: updatedData },
    ).exec();

    return this.widgetModel.findById(widget.id).exec();
  }
}
