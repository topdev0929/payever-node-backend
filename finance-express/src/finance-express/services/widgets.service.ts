import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inject } from '@nestjs/common';

import { CHANNEL_SET_SERVICE, ChannelSetServiceInterface, ChannelModel, ChannelService, ChannelSetModel } from '@pe/channels-sdk';
import { WidgetModel } from '../interfaces/entities';
import { UpdateWidgetDto, PaymentOptionDto } from '../dto';
import { BusinessModel } from '../../business/interfaces/entities';
import { WidgetSchemaName } from '../schemas';
import { ChannelsEnum, WidgetTypesEnum, PaymentOptionsEnum } from '../enums';
import { PaymentOptionInterface } from 'src/finance-express/interfaces';

export class WidgetsService {
  constructor(
    @InjectModel(WidgetSchemaName) private readonly widgetsModel: Model<WidgetModel>,
    private readonly channelService: ChannelService,
    @Inject(CHANNEL_SET_SERVICE) private readonly channelSetService: ChannelSetServiceInterface,
  ) { }

  public async create(dto: UpdateWidgetDto, business: BusinessModel): Promise<WidgetModel> {
    const widget: WidgetModel = await this.widgetsModel.findOne(
      {
        businessId: business._id,
        checkoutId: dto.checkoutId,
        type: dto.type,
      });

    if (widget) {
      return widget;
    }

    const channel: ChannelModel = await this.channelService.findOneByType(ChannelsEnum.FinanceExpress);
    const channelSet: ChannelSetModel = await this.channelSetService.create(channel, business);

    return this.widgetsModel.create({
      amountLimits: dto.amountLimits,
      businessId: business.id,
      channelSet,
      checkoutId: dto.checkoutId,
      checkoutMode: dto.checkoutMode,
      checkoutPlacement: dto.checkoutPlacement,
      isVisible: dto.isVisible,
      maxWidth: dto.maxWidth,
      minWidth: dto.minWidth,
      payments: dto.payments,
      ratesOrder: dto.ratesOrder,
      styles: dto.styles,
      type: dto.type,
      minHeight: dto.minHeight,
      maxHeight: dto.maxHeight,
      theme: dto.theme,
      alignment: dto.alignment,

      cancelUrl: dto.cancelUrl,
      failureUrl: dto.failureUrl,
      noticeUrl: dto.noticeUrl,
      pendingUrl: dto.pendingUrl,
      successUrl: dto.successUrl,
    });
  }

  public async update(widget: WidgetModel, dto: UpdateWidgetDto): Promise<WidgetModel> {
    return this.widgetsModel.findOneAndUpdate(
      {
        _id: widget.id,
      },
      {
        $set: {
          amountLimits: dto.amountLimits,
          checkoutMode: dto.checkoutMode,
          checkoutPlacement: dto.checkoutPlacement,
          isVisible: dto.isVisible,
          maxWidth: dto.maxWidth,
          minWidth: dto.minWidth,
          payments: dto.payments,
          ratesOrder: dto.ratesOrder,
          styles: dto.styles,
          type: dto.type,
          minHeight: dto.minHeight,
          maxHeight: dto.maxHeight,
          alignment: dto.alignment,
          theme: dto.theme,

          cancelUrl: dto.cancelUrl,
          failureUrl: dto.failureUrl,
          noticeUrl: dto.noticeUrl,
          pendingUrl: dto.pendingUrl,
          successUrl: dto.successUrl,
        },
      },
      { new: true },
    );
  }

  public async delete(widget: WidgetModel): Promise<void> {
    await widget.populate('channelSet').execPopulate();
    await this.widgetsModel.deleteOne({ _id: widget.id });
    await this.channelSetService.deleteOneById(widget.channelSet.id);
  }

  public async getWidgetsListForBusiness(business: BusinessModel): Promise<WidgetModel[]> {
    return this.widgetsModel.find({
      businessId: business._id,
    });
  }

  public async getWidgetsByType(
    business: BusinessModel,
    widgetType: WidgetTypesEnum,
  ): Promise<WidgetModel[]> {
    return this.widgetsModel.find(
      {
        businessId: business.id,
        type: widgetType,
      });
  }

  public async getWidgetsById(
    widgetId: string,
  ): Promise<WidgetModel> {
    return this.widgetsModel.findById(widgetId);
  }

  public async removePaymentOptions(
    paymentMethod: PaymentOptionsEnum,
    businessId: string,
  ): Promise<void> {
    const widgets: WidgetModel[] = await this.getWidgets(businessId);

    for (const widget of widgets) {
      const results: PaymentOptionInterface[] = widget.payments.filter( (payment: PaymentOptionDto) => {
        return payment?.paymentMethod && payment.paymentMethod !== paymentMethod;
      });

      await this.widgetsModel.findOneAndUpdate(
        {
          _id: widget.id,
        },
        {
          $set: {
            payments: results,
          },
        },
      );

    }
  }

  public async setPaymentState(
    paymentMethod: PaymentOptionsEnum,
    businessId: string,
    state: boolean,
    checkoutId?: string,
  ): Promise<void> {
    const widgets: WidgetModel[] = await this.getWidgets(businessId, checkoutId);

    for (const widget of widgets) {
      const results: PaymentOptionDto[] = [];
      widget.payments.forEach((payment: PaymentOptionDto) => {
        if (payment?.paymentMethod && payment.paymentMethod === paymentMethod) {
          payment.enabled = state;
        }
        results.push(payment);
      });

      await this.widgetsModel.findOneAndUpdate(
        {
          _id: widget.id,
        },
        {
          $set: {
            payments: results,
          },
        },
      );

    }
  }

  private async getWidgets(
    businessId: string,
    checkoutId?: string,
  ): Promise<WidgetModel[]> {
    const filter: any = {
      businessId,
    };
    if (checkoutId) {
      filter.checkoutId = checkoutId;
    }

    return this.widgetsModel.find(filter);
  }

}
