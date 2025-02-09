/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business/models';

import { WidgetTutorialInterface, WidgetTutorialStateInterface } from '../interfaces';
import { WidgetModel, WidgetTutorialModel } from '../models';

@Injectable()
export class WidgetTutorialService {
  constructor(
    @InjectModel('Business') private readonly businessModel: Model<BusinessModel>,
    @InjectModel('Widget') private readonly widgetModel: Model<WidgetModel>,
    @InjectModel('WidgetTutorial') private readonly widgetTutorialModel: Model<WidgetTutorialModel>,
  ) { }

  public async markWatched(
    widget: WidgetModel,
    business: BusinessModel,
  ): Promise<WidgetTutorialModel> {
    const tutorial: WidgetTutorialModel = await this.findOneByBusinessAndWidget(business, widget);
    await this.widgetTutorialModel.findOneAndUpdate(
      {
        _id: tutorial.id,
      },
      {
        watched: true,
      },
      {
        new: true,
      },
    ).exec();

    return this.findOneById(tutorial.id);
  }

  public async getWidgetsTutorialStateByBusiness(
    business: BusinessModel,
  ): Promise<WidgetTutorialStateInterface[]> {
    await business.populate('tutorials').execPopulate();
    let widgets: WidgetModel[];
    widgets = await this.widgetModel.find({ 'tutorial.url' : { $exists : true, $ne : '' }}).exec();

    return widgets.map((widget: WidgetModel) => {
      const widgetState: WidgetTutorialStateInterface = business.tutorials
        .find((u: WidgetTutorialModel) => u.widget === widget._id) || { watched: false, widget: null, order: null };

      return {
        order: widgetState.order === undefined ? null : widgetState.order,
        watched: widgetState.watched || false,
        widget: widget,
      };
    });

  }

  public async findOneByBusinessAndWidget(
    business: BusinessModel,
    widget: WidgetModel,
  ): Promise<WidgetTutorialModel> {
    await business.populate('tutorials').execPopulate();
    let tutorialWatched: WidgetTutorialModel = business.tutorials.find(
      (record: WidgetTutorialModel) => record.widget === widget._id,
    );

    if (!tutorialWatched) {
      const tutorialDto: WidgetTutorialInterface = {
        order: null,
        watched: false,
        widget: widget,
      };

      tutorialWatched = await this.widgetTutorialModel.create(tutorialDto as WidgetTutorialModel);
      await this.businessModel.findOneAndUpdate(
        { _id: business.id },
        { $push: { tutorials: tutorialWatched }},
      ).exec();
    }

    await tutorialWatched.populate('widget').execPopulate();

    return tutorialWatched;
  }

  public async findOneById(id: string): Promise<WidgetTutorialModel> {
    const tutorialWatched: WidgetTutorialModel = await this.widgetTutorialModel.findById(id).exec();
    await tutorialWatched.populate('widget').execPopulate();

    return tutorialWatched;
  }

  public async remove(widgetTutorial: WidgetTutorialModel): Promise<void> {
    await this.widgetTutorialModel.deleteOne({ _id: widgetTutorial.id }).exec();
  }

}
