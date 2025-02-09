import { Controller, forwardRef, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Document } from 'mongoose';
import * as dateFns from 'date-fns';
import { BusinessService } from '@pe/business-kit';

import { BusinessModel } from '../../business/models';
import { BusinessProductsService, ChannelSetProductsService } from '../../apps/products-app/services';
import { ChannelSetModel } from '../models';
import {
  BusinessIncomeService,
  ChannelSetIncomeService,
  ChannelSetService,
  TransactionsService,
  UserIncomeService,
} from '../services';
import {
  ExportMonthlyBusinessTransactionDto,
  ExportMonthlyUserPerBusinessTransactionDto,
  TransactionPaymentAddDto,
  TransactionPaymentSubtractDto,
} from '../dto';
import { UserModel, UserService } from '../../user';
import { CheckoutTransactionHistoryItemInterface } from '../interfaces';
import { PaymentActionsEnum } from '../enum';

const EXAMPLE_TRANSACTION_CHANNELSET: string = '00000000-0000-0000-0000-000000000000';

@Controller()
export class TransactionsBusMessageController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly userService: UserService,
    private readonly businessIncomeService: BusinessIncomeService,
    private readonly userIncomeService: UserIncomeService,
    private readonly channelSetService: ChannelSetService,
    private readonly channelSetIncomeService: ChannelSetIncomeService,
    private readonly transactionsService: TransactionsService,
    @Inject(forwardRef(() => BusinessProductsService))
    private readonly businessProductsService: BusinessProductsService,
    @Inject(forwardRef(() => ChannelSetProductsService))
    private readonly channelSetProductsService: ChannelSetProductsService,
  ) {
  }

  @MessagePattern({
    name: 'transactions.event.export.monthly-business-transaction',
  })
  public async onExportMonthlyBusinessTransaction(data: ExportMonthlyBusinessTransactionDto): Promise<void> {
    const business: BusinessModel = await this.businessService
    .findOneById(data._id) as unknown as BusinessModel;

    if (business) {
      await this.businessIncomeService.updateMonthlyAndTransaction(business, data);
    }
  }

  @MessagePattern({
    name: 'transactions.event.export.monthly-user-per-business-transaction',
  })
  public async onExportMonthlyUserTransaction(data: ExportMonthlyUserPerBusinessTransactionDto): Promise<void> {
    await this.userIncomeService.updateUserPerBusinessMonthly(data);
  }

  @MessagePattern({
    name: 'transactions.event.payment.paid',
  })
  public async onPaymentPaidEvent(data: TransactionPaymentAddDto): Promise<void> {
    const business: BusinessModel = await this.businessService
    .findOneById(data.business.id) as unknown as BusinessModel;

    if (!business) {
      return;
    }

    const user: UserModel = data.user && data.user.id && await this.userService.findOneById(data.user.id);

    const channelSet: ChannelSetModel = await this.channelSetService.findOneById(data.channel_set.id);
    if (!channelSet && data.channel_set.id !== EXAMPLE_TRANSACTION_CHANNELSET) {
      return;
    }

    await this.businessIncomeService.add(business, new Date(data.date), data.amount);
    if (user) {
      await this.userIncomeService.add(user, business, new Date(data.date), data.amount);
    }
    if (channelSet) {
      await this.channelSetIncomeService.add(channelSet, new Date(data.date), data.amount);
    }

    if (data.items) {
      for (const item of data.items) {
        await this.businessProductsService.processCartItem(business, item, data.date);
        if (channelSet) {
          await this.channelSetProductsService.processCartItem(channelSet, item, data.date);
        }
      }
    }

    await this.transactionsService.considerTransaction(data.id, business);
  }

  @MessagePattern({
    name: 'transactions.event.payment.refund',
  })
  public async onPaymentRefundEvent(data: TransactionPaymentSubtractDto): Promise<void> {
    const business: BusinessModel = await this.businessService
    .findOneById(data.business.id) as unknown as BusinessModel;

    if (!business) {
      return;
    }

    const user: UserModel = data.user && data.user.id && await this.userService.findOneById(data.user.id);

    const channelSet: ChannelSetModel = await this.channelSetService.findOneById(data.channel_set.id);
    if (!channelSet && data.channel_set.id !== EXAMPLE_TRANSACTION_CHANNELSET) {
      return;
    }

    const transaction: Document = await this.transactionsService.findOneById(data.id);
    if (!transaction) {
      return;
    }

    const today: Date = new Date();
    const last30Days: Date = dateFns.addDays(today, -30);

    const historyItem: CheckoutTransactionHistoryItemInterface = this.getLastRefund(data.history);

    if (new Date(data.last_updated) >= last30Days) {
      if (user) {
        await this.userIncomeService.subtract(user, business, new Date(data.date), historyItem.amount);
      }
      await this.businessIncomeService.subtract(business, new Date(data.date), historyItem.amount);
      if (channelSet) {
        await this.channelSetIncomeService.subtract(channelSet, new Date(data.date), historyItem.amount);
      }
    }
  }

  @MessagePattern({
    name: 'transactions.event.payment.removed',
  })
  public async onPaymentRemovedEvent(data: TransactionPaymentSubtractDto): Promise<void> {
    const business: BusinessModel = await this.businessService
    .findOneById(data.business.id) as unknown as BusinessModel;

    if (!business) {
      return;
    }

    const channelSet: ChannelSetModel = await this.channelSetService.findOneById(data.channel_set.id);
    if (!channelSet && data.channel_set.id !== EXAMPLE_TRANSACTION_CHANNELSET) {
      return;
    }

    const transaction: Document = await this.transactionsService.findOneById(data.id);
    if (!transaction) {
      return;
    }

    await this.businessIncomeService.subtract(business, new Date(data.date), data.amount);
    if (channelSet) {
      await this.channelSetIncomeService.subtract(channelSet, new Date(data.date), data.amount);
    }

    await this.transactionsService.removeById(data.id);
  }

  private getLastRefund(
    history: CheckoutTransactionHistoryItemInterface[],
  ): CheckoutTransactionHistoryItemInterface {
    return history.filter(
      (item: CheckoutTransactionHistoryItemInterface) => item.action === PaymentActionsEnum.Refund,
    ).pop();
  }

}
