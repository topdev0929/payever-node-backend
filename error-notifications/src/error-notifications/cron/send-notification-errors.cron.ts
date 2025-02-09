import { Injectable, Logger } from '@nestjs/common';
import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import * as dateFns from 'date-fns';
import * as cron from 'node-cron';
import { EmailSender, ErrorNotificationService, SettingsService, TransactionsService } from '../services';
import { ErrorNotificationAggregateDto, SeparatedDateDto } from '../dto';
import { CronUpdateIntervalEnum } from '../enums';
import {
  ErrorNotificationInterface,
  SettingsInterface,
  SettingsTimeFrameItem,
  TimeFramePeriodInterface,
} from '../interfaces';
import { ErrorNotificationModel, SettingsModel, TransactionModel } from '../models';
import { DateTransformer } from '../transformers';
import { TimeFrameHelper } from '../helpers/time-frame.helper';

@Injectable()
export class SendNotificationErrorsCron extends Server implements CustomTransportStrategy {
  constructor(
    protected readonly logger: Logger,
    private readonly errorNotificationService: ErrorNotificationService,
    private readonly emailSender: EmailSender,
    private readonly settingsService: SettingsService,
    private readonly transactionsService: TransactionsService,
  ) {
    super();
  }

  public async listen(callback: () => void): Promise<void> {
    await cron.schedule('*/1 * * * *', () =>
      this.sendNotificationErrorsByAfterInterval());
    await cron.schedule('*/5 * * * *', () =>
      this.sendNotificationErrorsByCronInterval(CronUpdateIntervalEnum.every5minutes));
    await cron.schedule('0 * * * *', () =>
      this.sendNotificationErrorsByCronInterval(CronUpdateIntervalEnum.everyHour));
    await cron.schedule('0 8 * * *', () =>
      this.sendNotificationErrorsByCronInterval(CronUpdateIntervalEnum.every24Hours));

    this.logger.log(
      'Notification errors cron: Configured cron schedule for notification errors send',
    );

    callback();
  }

  public async close(): Promise<void> {
    return null;
  }

  public async sendNotificationErrorsByCronInterval(updateInterval: CronUpdateIntervalEnum): Promise<void> {
    this.logger.log('Notification errors cron: Starting errors send...', updateInterval);

    const dateTo: Date = new Date();
    const dateFrom: Date = SendNotificationErrorsCron.getStartDate(dateTo, updateInterval);

    try {
      const errorNotifications: ErrorNotificationAggregateDto[] =
        await this.getErrorNotificationsToSendByCronInterval(dateFrom, dateTo, updateInterval);

      const remindErrorNotifications: ErrorNotificationModel[] =
        await this.getRemindedNotificationsToSendByCronInterval(dateTo);

      const errorNotificationsToSend: ErrorNotificationAggregateDto[] =
        this.combineErrorNotifications(errorNotifications, remindErrorNotifications);

      for (const errorNotificationDto of errorNotificationsToSend) {
        await this.emailSender.sendEmails(errorNotificationDto);
      }

    } catch (error) {
      this.logger.error({
        error: error.message,
        message: 'Notification errors cron: Failed to send errors',
      });
      throw error;
    }
  }

  public async sendNotificationErrorsByAfterInterval(): Promise<void> {
    this.logger.log('Notification errors cron: Starting errors send by after interval...', '');

    const errorNotifications: ErrorNotificationAggregateDto[] =
      await this.errorNotificationService.getErrorNotificationDeliveryReadyAfterInterval();

    const currentDateUTC: Date = new Date();
    currentDateUTC.setMilliseconds(0);
    const currentDateCET: Date = DateTransformer.convertLocalToCETTimeZone(currentDateUTC);

    const separatedDate: SeparatedDateDto = DateTransformer.getSeparatedDate(currentDateCET);

    let errorNotificationsToSend: ErrorNotificationAggregateDto;
    for (const errorNotification of errorNotifications) {
      errorNotificationsToSend = { ...errorNotification};
      errorNotificationsToSend.errors = [];

      for (const error of errorNotification.errors) {
        if (await this.isEmailShouldBeSent(error, currentDateCET, separatedDate)) {
          errorNotificationsToSend.errors.push(error);
        }
      }
      if (errorNotificationsToSend.errors.length > 0 ) {
        await this.emailSender.sendEmails(errorNotificationsToSend);
        await this.errorNotificationService.setErrorNotificationsEmailSent(errorNotificationsToSend, currentDateUTC);
      }
    }
  }

  private async getErrorNotificationsToSendByCronInterval(
    dateFrom: Date,
    dateTo: Date,
    updateInterval: CronUpdateIntervalEnum,
  ): Promise<ErrorNotificationAggregateDto[]> {
    const errorNotifications: ErrorNotificationAggregateDto[] =
      await this.errorNotificationService.getErrorNotificationDeliveryReadyCronInterval(
        dateFrom,
        dateTo,
      );

    const result: ErrorNotificationAggregateDto[] = [];
    for (const errorNotification of errorNotifications) {
      const settings: SettingsInterface = await this.settingsService.getSettingsByParams(
        errorNotification.businessId,
        errorNotification.type,
        errorNotification.integration,
      );

      if (settings && settings.isEnabled && (settings.updateInterval === updateInterval)) {
        result.push(errorNotification);
      }
    }

    return result;
  }

  private async getRemindedNotificationsToSendByCronInterval(
    dateTo: Date,
  ): Promise<ErrorNotificationModel[]> {
    const settings: SettingsModel[] = await this.settingsService.getSettingsByReminderOption();

    const notifications: ErrorNotificationModel[] = [];
    for (const setting of settings) {
      if (!setting.isEnabled) {
        continue;
      }

      const repeatDateFrom: Date = dateFns.addMinutes(dateTo, -setting.repeatFrequencyInterval);
      const reminds: ErrorNotificationModel[] =
        await this.errorNotificationService.getErrorNotificationToRemind(
          repeatDateFrom,
          dateTo,
          setting.businessId,
          setting.type,
          setting.integration,
        );

      for (const remind of reminds) {
        if (!notifications.includes(remind)) {
          notifications.push(remind);
        }
      }
    }

    return notifications;
  }

  private combineErrorNotifications(
    errorNotifications: ErrorNotificationAggregateDto[],
    remindedErrorNotification: ErrorNotificationModel[],
  ): ErrorNotificationAggregateDto[] {
    for (const reminded of remindedErrorNotification) {
      let aggregated: ErrorNotificationAggregateDto =
        errorNotifications.find((aggregatedItem: ErrorNotificationAggregateDto) => {
          return aggregatedItem.type === reminded.type &&
            aggregatedItem.businessId === reminded.businessId &&
            aggregatedItem.integration === reminded.integration;
          });

      let errorItem: ErrorNotificationInterface = null;
      let index: number = -1;
      if (aggregated) {
        index = errorNotifications.indexOf(aggregated);
        errorItem = aggregated.errors.find( (item: ErrorNotificationInterface) => {
          return item.errorDate === reminded.errorDate;
        });
      } else {
        aggregated = {
          businessId: reminded.businessId,
          errors: [],
          integration: reminded.integration,
          type: reminded.type,
        };
        errorNotifications.push(aggregated);
        index = errorNotifications.length - 1;
      }

      if (!errorItem) {
        errorNotifications[index].errors.push(reminded);
      }
    }

    return errorNotifications;
  }

  private async isEmailShouldBeSent(
    error: ErrorNotificationInterface,
    currentDate: Date,
    separatedDate: SeparatedDateDto,
  ): Promise<boolean> {
    const settings: SettingsInterface = await this.settingsService.getSettingsByParams(
      error.businessId,
      error.type,
      error.integration,
    );

    if (!settings.isEnabled) {
      return false;
    }

    const timeFrame: SettingsTimeFrameItem = settings ?
      await this.getFirstAcceptableTimeFrame(
        settings,
        separatedDate,
        currentDate,
      ) : null;

    if (timeFrame && timeFrame.sendEmailAfterInterval > 0) {
      if (!error.emailSent) {
        return dateFns.addMinutes(
          DateTransformer.convertLocalToCETTimeZone(error.errorDate),
          timeFrame.sendEmailAfterInterval,
        ) <= currentDate;
      } else {
        if (
          (timeFrame.repeatFrequencyInterval !== 0) &&
          (dateFns.addMinutes(
            DateTransformer.convertLocalToCETTimeZone(error.lastTimeSent),
            timeFrame.repeatFrequencyInterval,
          ) <= currentDate)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  private static getStartDate(baseDate: Date, updateInterval: CronUpdateIntervalEnum ): Date {
    switch (updateInterval) {
      case CronUpdateIntervalEnum.every5minutes:
        return dateFns.addMinutes(baseDate, -5);
      case CronUpdateIntervalEnum.everyHour:
        return dateFns.addHours(baseDate, -1);
      case CronUpdateIntervalEnum.every24Hours:
        return dateFns.addDays(baseDate, -1);
      default:
        return baseDate;
    }
  }

  private async getFirstAcceptableTimeFrame(
    settings: SettingsInterface,
    separatedDate: SeparatedDateDto,
    currentDate: Date,
  ): Promise<SettingsTimeFrameItem> {
    for (const timeFrame of settings.timeFrames) {
      const period: TimeFramePeriodInterface = TimeFrameHelper.getTimeFramePeriod(timeFrame, currentDate);

      const timeCondition: boolean = (period.startTime <= currentDate && currentDate < period.endTime)
        && (timeFrame.startDayOfWeek <= separatedDate.dayOfWeek && separatedDate.dayOfWeek <= timeFrame.endDayOfWeek);

      let statusCondition: boolean = true;
      if (timeCondition && timeFrame.statusCondition) {
        const transactions: TransactionModel[] = await this.transactionsService.getLastTransactions(
          settings.businessId,
          settings.integration,
          timeFrame.statusCondition.value,
        );

        const enoughCountOfTransactions: boolean = transactions.length === timeFrame.statusCondition.value;
        const transactionsStatus: TransactionModel[] = transactions.filter((transaction: TransactionModel) => {
          return transaction.status === timeFrame.statusCondition.status;
        });
        const percentOfStatuses: number = transactionsStatus.length / transactions.length * 100;

        statusCondition = enoughCountOfTransactions && (percentOfStatuses >= timeFrame.statusCondition.percent);
      }
      if (timeCondition && statusCondition) {
        return timeFrame;
      }
    }

    return null;
  }
}
