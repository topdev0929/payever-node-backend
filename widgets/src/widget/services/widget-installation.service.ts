/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BusinessService } from '@pe/business-kit';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { UserModel } from '../../user/models';
import { ApplicationUninstalledDto, ApplicationInstalledDto } from '../dto';

import { PendingAppInstallationInterface, WidgetInstallationInterface, WidgetInstallationStateInterface } from '../interfaces';
import { OnboardingAppInstallationModel, PendingAppInstallationModel, WidgetInstallationModel, WidgetModel } from '../models';

@Injectable()
export class WidgetInstallationService {
  constructor(
    @InjectModel('Business') private readonly businessModel: Model<BusinessModel>,
    @InjectModel('User') private readonly userModel: Model<UserModel>,
    @InjectModel('Widget') private readonly widgetModel: Model<WidgetModel>,
    private readonly businessService: BusinessService,
    @InjectModel('WidgetInstallation') private readonly widgetInstallationModel: Model<WidgetInstallationModel>,
    @InjectModel('OnboardingAppInstallation')
      private readonly onboardingAppInstallationModel: Model<OnboardingAppInstallationModel>,
    @InjectModel('PendingAppInstallation')
      private readonly pendingAppInstallationModel: Model<PendingAppInstallationModel>,
  ) { }

  public async initWidgetsToBusiness(
    business: BusinessModel,
  ): Promise<{ }> {

    const widgets: WidgetModel[] = await this.widgetModel.find({ }).exec();

    const tasks: Array<Promise<WidgetInstallationModel>>
      = widgets.map((widget: WidgetModel) => this.installToBusiness(
        widget,
        business,
        true,
      ));

    const result: { } = await Promise.all(tasks);

    await this.installAllPendingAppInstallations(business);

    return result;
  }

  public async installWidgetsToBusiness(
    business: BusinessModel,
    restorePreviousState: boolean = false,
  ): Promise<{ }> {
    await business.populate('installations').execPopulate();
    const widgets: WidgetModel[] = await this.widgetModel.find({ }).exec();

    const tasks: Array<Promise<WidgetInstallationModel>>
      = widgets.map((widget: WidgetModel) => this.installToBusiness(
        widget,
        business,
        true,
        restorePreviousState,
      ));

    const result: { } = await Promise.all(tasks);

    await this.installAllPendingAppInstallations(business);

    return result;
  }

  public async installAllPendingAppInstallations(
    businessData: BusinessModel,
  ): Promise<void> {
    const business: BusinessModel = await this.businessService
      .findOneById(businessData._id) as  unknown as BusinessModel;
    const pendingAppInstallations: PendingAppInstallationModel[] = await this.pendingAppInstallationModel.find({
      businessId: business.id,
    }).exec();


    const widgets: WidgetModel[] = await this.widgetModel.find(
      { type: { $in: pendingAppInstallations.map((app: any) => app.code) } },
    ).exec();

    await this.widgetInstallationModel.updateMany(
      {
        _id: { $in: business.installations },
        widget: { $in: widgets.map((widget: WidgetModel) => widget._id) },
      },
      {
        $set: { installed: true },
      },
    ).exec();

    await this.pendingAppInstallationModel.deleteMany(
      { _id: { $in: pendingAppInstallations.map((app: any) => app._id) } },
    ).exec();


    await this.onboardingAppInstallationModel.findOneAndUpdate(
      { businessId: business.id },
      {
        $set: {
          businessId: business.id,
          businessInstallation: true,
        },
      },
      {
        upsert: true,
      },
    );
  }

  public async installWidgetsToUser(
    user: UserModel,
  ): Promise<{ }> {
    await user.populate('installations').execPopulate();
    const widgets: WidgetModel[] =
      await this.widgetModel.find({ type: { $in: ['transactions', 'settings', 'apps'] }}).exec();

    const tasks: Array<Promise<WidgetInstallationModel>>
      = widgets.map((widget: WidgetModel) => this.installToUser(widget, user));

    return Promise.all(tasks);
  }

  public async installToBusiness(
    widget: WidgetModel,
    business: BusinessModel,
    checkWidgetInstallByDefault: boolean = false,
    restorePreviousState: boolean = false,
  ): Promise<WidgetInstallationModel> {
    const installation: WidgetInstallationModel = await this.findOneByBusinessAndWidget(business, widget);
    const installed: boolean = checkWidgetInstallByDefault ? widget.installByDefault : true;

    await this.widgetInstallationModel.findOneAndUpdate(
      {
        _id: installation.id,
      },
      {
        installed: restorePreviousState ? installation.installed : installed,
      },
      {
        new: true,
      },
    ).exec();

    return this.findOneById(installation.id);
  }

  public async installToUser(
    widget: WidgetModel,
    user: UserModel,
  ): Promise<WidgetInstallationModel> {
    const installation: WidgetInstallationModel = await this.findOneByUserAndWidget(user, widget);
    await this.widgetInstallationModel.findOneAndUpdate(
      {
        _id: installation.id,
      },
      {
        installed: true,
      },
      {
        new: true,
      },
    ).exec();

    return this.findOneById(installation.id);
  }

  public async uninstallFromUser(
    widget: WidgetModel,
    user: UserModel,
  ): Promise<WidgetInstallationModel> {
    const installation: WidgetInstallationModel = await this.findOneByUserAndWidget(user, widget);
    await this.widgetInstallationModel.findOneAndUpdate(
      {
        _id: installation.id,
      },
      {
        installed: false,
      },
      {
        new: true,
      },
    ).exec();

    return this.findOneById(installation.id);
  }

  public async uninstall(
    widget: WidgetModel,
    business: BusinessModel,
  ): Promise<WidgetInstallationModel> {
    const installation: WidgetInstallationModel = await this.findOneByBusinessAndWidget(business, widget);
    await this.widgetInstallationModel.findOneAndUpdate(
      {
        _id: installation.id,
      },
      {
        installed: false,
      },
      {
        new: true,
      },
    ).exec();

    return this.findOneById(installation.id);
  }

  public async addPendingInstallation(data: PendingAppInstallationInterface): Promise<void> {
    await this.pendingAppInstallationModel.create(data);
  }

  public async findOneByBusinessAndWidget(
    business: BusinessModel,
    widget: WidgetModel,
  ): Promise<WidgetInstallationModel> {
    await business.populate('installations').execPopulate();
    let installation: WidgetInstallationModel = business.installations.find(
      (record: WidgetInstallationModel) => record.widget === widget._id,
    );

    if (!installation) {
      const installedByDefault: string[] = ['App'];

      let installationDto: WidgetInstallationInterface;
      if (installedByDefault.includes(widget.title)) {
        installationDto = {
          installed: true,
          order: null,
          widget: widget,
        };
      } else {
        installationDto = {
          installed: false,
          order: null,
          widget: widget,
        };
      }


      installation = await this.widgetInstallationModel.create(installationDto as WidgetInstallationModel);
      await this.businessModel.findOneAndUpdate(
        { _id: business.id },
        { $push: { installations: installation } },
      ).exec();
    }

    await installation.populate('widget').execPopulate();

    return installation;
  }

  public async findOneByUserAndWidget(
    user: UserModel,
    widget: WidgetModel,
  ): Promise<WidgetInstallationModel> {
    await user.populate('installations').execPopulate();
    let installation: WidgetInstallationModel = user.installations.find(
      (record: WidgetInstallationModel)  => record.widget === widget._id,
    );

    if (!installation) {
      const installationDto: WidgetInstallationInterface = {
        installed: false,
        order: null,
        widget: widget,
      };

      installation = await this.widgetInstallationModel.create(installationDto as WidgetInstallationModel);
      await this.userModel.findOneAndUpdate(
        { _id: user.id },
        { $push: { installations: installation }},
      ).exec();
    }

    await installation.populate('widget').execPopulate();

    return installation;
  }

  public async handleApplicationInstalledEvent(data: ApplicationInstalledDto): Promise<boolean> {
    const widget: WidgetModel = await this.widgetModel.findOne({ type: data.code });
    if (!widget) {
      return false;
    }

    const business: BusinessModel = await this.businessService
      .findOneById(data.businessId) as  unknown as BusinessModel;
    if (!business) {
      await this.addPendingInstallation(data);

      return false;
    }

    await this.installToBusiness(widget, business);

    return true;
  }

  public async installApps(
    body: {
      apps: string[];
      businessId: string;
    },
  ): Promise<boolean> {

    for (const app of body.apps) {
      await this.handleApplicationInstalledEvent({
        businessId: body.businessId,
        code: app,
      });
    }

    await this.onboardingAppInstallationModel.findOneAndUpdate(
      { businessId: body.businessId },
      {
        $set: {
          businessId: body.businessId,
          widgetInstallation: true,
        },
      },
      {
        upsert: true,
      },
    );

    return true;
  }

  public async handleApplicationUninstalledEvent(data: ApplicationUninstalledDto): Promise<void> {
    const widget: WidgetModel = await this.widgetModel.findOne({ type: data.code });
    if (!widget) {
      return;
    }

    const business: BusinessModel = await this.businessService
      .findOneById(data.businessId) as unknown as BusinessModel;
    if (!business) {
      return;
    }

    await this.uninstall(widget, business);
  }

  public async getOnboardingStatusByBusiness(
    business: BusinessModel,
  ): Promise<boolean> {
    return !!(await this.onboardingAppInstallationModel.findOne(
      {
        businessId: business._id,
        businessInstallation: true,
        widgetInstallation: true,
      },
    ));
  }

  public async getWidgetsStateByBusiness(
    business: BusinessModel,
  ): Promise<WidgetInstallationStateInterface[]> {
    await business.populate('installations').execPopulate();
    let widgets: WidgetModel[];
    widgets = await this.widgetModel.find({ }).exec();

    return widgets.map((widget: WidgetModel) => {
      const widgetState: WidgetInstallationInterface = business.installations.find(
        (u: WidgetInstallationModel) => u.widget === widget._id) || { installed: false, order: null, widget: null };

      return {
        installed: widgetState.installed || false,
        order: widgetState.order === undefined ? null : widgetState.order,
        widget: widget,
      };
    });

  }

  public async getWidgetsStateByUser(
    user: UserModel,
  ): Promise<WidgetInstallationStateInterface[]> {
    await user.populate('installations').execPopulate();
    let widgets: WidgetModel[];
    widgets = await this.widgetModel.find({ type: { $in: ['transactions', 'settings', 'message', 'apps'] }}).exec();

    return widgets.map((widget: WidgetModel) => {
      const widgetState: WidgetInstallationInterface = user.installations.find(
        (u: WidgetInstallationModel) => u.widget === widget._id) || { installed: false, order: null, widget: null };

      return {
        installed: widgetState.installed || false,
        order: widgetState.order === undefined ? null : widgetState.order,
        widget: widget,
      };
    });

  }

  public async findOneById(id: string): Promise<WidgetInstallationModel> {
    const installation: WidgetInstallationModel = await this.widgetInstallationModel.findById(id).exec();
    await installation.populate('widget').execPopulate();

    return installation;
  }

  public async remove(widgetInstallation: WidgetInstallationModel): Promise<void> {
    await this.widgetInstallationModel.deleteOne({ _id: widgetInstallation.id }).exec();
  }
}
