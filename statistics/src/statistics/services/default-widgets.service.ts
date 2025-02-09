import { Injectable } from '@nestjs/common';
import { BusinessModel, DashboardModel } from '../models';
import { WidgetTypeEnum } from '../enums';
import { WidgetService } from './widget.service';
import { DefaultWidgetsHelper } from '../helpers/default-widgets.helper';
import { BusinessService } from '@pe/business-kit';
import { IntegrationModel } from '../models/integration.model';
import { IntegrationService } from './integration.service';
import { ShopModel } from '../../shops/interfaces/entities/shop.model';
import { TerminalModel } from '../../pos/interfaces/entities/terminal.model';
import { SiteModel } from '../../sites/interfaces/entities/site.model';

@Injectable()
export class DefaultWidgetsService {
  constructor(
    private readonly widgetService: WidgetService,
    private readonly businessService: BusinessService<BusinessModel>,
    private readonly integrationService: IntegrationService,
  ) { }

  public async build(
    dashboard: DashboardModel,
    business: BusinessModel,
    shop: ShopModel,
    terminal: TerminalModel,
    site: SiteModel,
  ): Promise<any> {
    let paymentMethods: string[] = [];
    let channels: string[] = [];
    try {
      const result: { paymentMethods: string[]; channels: string[] } =
        await this.widgetService.getWidgetData(business, WidgetTypeEnum.Transactions);

      if (result.paymentMethods) {
        const integrations: IntegrationModel[] = await this.integrationService.find(
          {
            'installationOptions.countryList': { $in: [business.businessDetail?.companyAddress?.country] },
            name: { $in: result.paymentMethods },
          },
        );
        paymentMethods = integrations.map((method: IntegrationModel) => method.name);
        channels = result.channels;
      }
    } catch (err) {
      return;
    }
    
    const businesses: BusinessModel[] = await this.businessService.findAll({ owner: business.owner });
    const defaultWidgets: any = DefaultWidgetsHelper.getDefaultWidgets(
      business,
      shop,
      terminal,
      site,
      paymentMethods,
      channels,
      businesses.map((i: BusinessModel) => i._id),
    );

    for (const defaultwidget of defaultWidgets) {
      await this.widgetService.create(dashboard, defaultwidget);
    }
  }
}
