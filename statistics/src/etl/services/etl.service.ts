import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessService } from '@pe/business-kit';

import { Loader } from '../common';
import { SourceEnum } from '../enums';
import { PaymentModel, PaymentLeanDocument, CheckoutMetricsLeanDocument } from '../models';
import { PaymentSchemaName } from '../schemas';
import { MongodbOptionsInterface } from '../interfaces';
import { ShopEventsSchemaName } from '../schemas/shop-events.schema';
import { SiteEventsSchemaName } from '../schemas/site-events.schema';
import { EventsInterface } from '../interfaces/events.interface';
import { StatisticsEventsInterface } from '../interfaces/statistics-events.interface';
import { PosEventsSchemaName } from '../schemas/pos-events.schema';
import { SubscriptionsEventsSchemaName } from '../schemas/subscriptions-events.schema';
import { MessageEventsSchemaName } from '../schemas/message-events.schema';
import { StatisticsEventsModel } from '../models/statistics-events.model';
import { BlogEventsSchemaName } from '../schemas/blog-events.schema';
import { TransactionsPaymentExportDto } from '../dto/transactions-event';

const BATCH_SIZE: number = 2000;

@Injectable()
export class EtlService {
  public currentState: string = null;

  private logger: Logger = new Logger(EtlService.name, true);

  constructor(
    private readonly loader: Loader,
    private readonly businessService: BusinessService,
    @InjectModel(PaymentSchemaName)
    private readonly paymentModel: Model<PaymentModel>,
    @InjectModel(ShopEventsSchemaName)
    private readonly shopEvents: Model<StatisticsEventsModel>,
    @InjectModel(SiteEventsSchemaName)
    private readonly siteEvents: Model<StatisticsEventsModel>,
    @InjectModel(PosEventsSchemaName)
    private readonly posEvents: Model<StatisticsEventsModel>,
    @InjectModel(SubscriptionsEventsSchemaName)
    private readonly subscriptionsEvents: Model<StatisticsEventsModel>,
    @InjectModel(MessageEventsSchemaName)
    private readonly messageEvents: Model<StatisticsEventsModel>,
    @InjectModel(BlogEventsSchemaName)
    private readonly blogEvents: Model<StatisticsEventsModel>,
  ) {
  }

  public async updateCustomerData(payment: TransactionsPaymentExportDto): Promise<void> {
    if (!payment.customer || !payment.customer.email) {
      return;
    }
    await this.paymentModel.updateOne({
      _id: payment.id,
    }, {
      $set: {
        userId: payment.user ? payment.user.id : null,
        customerName: payment.customer ? payment.customer.name : null,
        customerEmail: payment.customer ? payment.customer.email : null,
      },
    });
  }

  public async importShops(): Promise<void> {
    const options: MongodbOptionsInterface<PaymentModel> = {
      batchSize: BATCH_SIZE,
      collection: 'events',
      condition: { },
      db: 'shop',
      sort: {
        createdAt: 1,
      },
      target: 'events',
    };
    const lastDoc: StatisticsEventsModel = await this.shopEvents.findOne().sort({ createdAt: -1 }).exec();

    if (lastDoc) {
      options.condition = {
        createdAt: {
          $gt: lastDoc.createdAt,
        },
      };
    }

    const batch: EventsInterface[] = [];

    const dataStream: AsyncGenerator<EventsInterface> =
      await this.loader.getData<EventsInterface>(SourceEnum.Mongodb, options);

    let total: number = 0;

    const processBatch: () => Promise<void> = async (): Promise<void> => {
      const aggregatedBatch: StatisticsEventsInterface[] = this.getAggregatedBatch(batch);
      await this.shopEvents.insertMany(aggregatedBatch);
      this.logger.log(`importShopMetrics: batch done with ${batch.length}`);
      batch.length = 0;
    };

    for await (const sourcePayment of dataStream) {
      if (batch.length > BATCH_SIZE) {
        await processBatch();
      }
      batch.push(sourcePayment);
      total++;
    }
    await processBatch();

    this.logger.log(`importShopMetrics: ${total}`);
  }

  public async updateShops(): Promise<void> {
    const options: MongodbOptionsInterface<PaymentModel> = {
      collection: 'events',
      condition: { },
      db: 'shop',
      sort: {
        updatedAt: 1,
      },
      target: 'events',
    };
    const lastDoc: StatisticsEventsModel = await this.shopEvents.findOne().sort({ updatedAt: -1 }).exec();

    if (lastDoc) {
      options.condition = {
        updatedAt: {
          $gt: lastDoc.updatedAt,
        },
      };
    }

    const batch: EventsInterface[] = [];

    const dataStream: AsyncGenerator<EventsInterface> = await this.loader.getData(SourceEnum.Mongodb, options);

    let total: number = 0;

    const processBatch: () => Promise<void> = async (): Promise<void> => {
      await Promise.all(batch.map((shopEvent: EventsInterface) => {
        return this.shopEvents.deleteMany({ applicationId: shopEvent.applicationId, createdAt: shopEvent.createdAt });
      }));
      const aggregatedBatch: StatisticsEventsInterface[] = this.getAggregatedBatch(batch);

      await this.shopEvents.insertMany(aggregatedBatch);

      this.logger.log(`updateShopMetrics: batch done with ${batch.length}`);
      batch.length = 0;
    };

    for await (const sourcePayment of dataStream) {
      if (batch.length > BATCH_SIZE) {
        await processBatch();
      }
      batch.push(sourcePayment);
      total++;
    }
    await processBatch();

    this.logger.log(`updateShopMetrics: ${total}`);
  }

  public async importSites(): Promise<void> {
    const options: MongodbOptionsInterface<PaymentModel> = {
      batchSize: BATCH_SIZE,
      collection: 'events',
      condition: { },
      db: 'site',
      sort: {
        createdAt: 1,
      },
      target: 'events',
    };
    const lastDoc: StatisticsEventsModel = await this.siteEvents.findOne().sort({ createdAt: -1 }).exec();

    if (lastDoc) {
      options.condition = {
        createdAt: {
          $gt: lastDoc.createdAt,
        },
      };
    }

    const batch: EventsInterface[] = [];

    const dataStream: AsyncGenerator<EventsInterface> =
      await this.loader.getData<EventsInterface>(SourceEnum.Mongodb, options);

    let total: number = 0;

    const processBatch: () => Promise<void> = async (): Promise<void> => {
      const aggregatedBatch: StatisticsEventsInterface[] = this.getAggregatedBatch(batch);
      await this.siteEvents.insertMany(aggregatedBatch);
      this.logger.log(`importSiteMetrics: batch done with ${batch.length}`);
      batch.length = 0;
    };

    for await (const sourcePayment of dataStream) {
      if (batch.length > BATCH_SIZE) {
        await processBatch();
      }
      batch.push(sourcePayment);
      total++;
    }
    await processBatch();

    this.logger.log(`importSiteMetrics: ${total}`);
  }

  public async updateSites(): Promise<void> {
    const options: MongodbOptionsInterface<PaymentModel> = {
      collection: 'events',
      condition: { },
      db: 'site',
      sort: {
        updatedAt: 1,
      },
      target: 'events',
    };
    const lastDoc: StatisticsEventsModel = await this.siteEvents.findOne().sort({ updatedAt: -1 }).exec();

    if (lastDoc) {
      options.condition = {
        updatedAt: {
          $gt: lastDoc.updatedAt,
        },
      };
    }

    const batch: EventsInterface[] = [];

    const dataStream: AsyncGenerator<EventsInterface> = await this.loader.getData(SourceEnum.Mongodb, options);

    let total: number = 0;

    const processBatch: () => Promise<void> = async (): Promise<void> => {
      await Promise.all(batch.map((siteEvent: EventsInterface) => {
        return this.siteEvents.deleteMany({ applicationId: siteEvent.applicationId, createdAt: siteEvent.createdAt });
      }));
      const aggregatedBatch: StatisticsEventsInterface[] = this.getAggregatedBatch(batch);

      await this.siteEvents.insertMany(aggregatedBatch);

      this.logger.log(`updateSiteMetrics: batch done with ${batch.length}`);
      batch.length = 0;
    };

    for await (const sourcePayment of dataStream) {
      if (batch.length > BATCH_SIZE) {
        await processBatch();
      }
      batch.push(sourcePayment);
      total++;
    }
    await processBatch();

    this.logger.log(`updateSiteMetrics: ${total}`);
  }

  public async importPos(): Promise<void> {
    const options: MongodbOptionsInterface<PaymentModel> = {
      batchSize: BATCH_SIZE,
      collection: 'events',
      condition: { },
      db: 'pos',
      sort: {
        createdAt: 1,
      },
      target: 'events',
    };
    const lastDoc: StatisticsEventsModel = await this.posEvents.findOne().sort({ createdAt: -1 }).exec();

    if (lastDoc) {
      options.condition = {
        createdAt: {
          $gt: lastDoc.createdAt,
        },
      };
    }

    const batch: EventsInterface[] = [];

    const dataStream: AsyncGenerator<EventsInterface> =
      await this.loader.getData<EventsInterface>(SourceEnum.Mongodb, options);

    let total: number = 0;

    const processBatch: () => Promise<void> = async (): Promise<void> => {
      const aggregatedBatch: StatisticsEventsInterface[] = this.getAggregatedBatch(batch);
      await this.posEvents.insertMany(aggregatedBatch);
      this.logger.log(`importPosMetrics: batch done with ${batch.length}`);
      batch.length = 0;
    };

    for await (const sourcePayment of dataStream) {
      if (batch.length > BATCH_SIZE) {
        await processBatch();
      }
      batch.push(sourcePayment);
      total++;
    }
    await processBatch();

    this.logger.log(`importPosMetrics: ${total}`);
  }

  public async updatePos(): Promise<void> {
    const options: MongodbOptionsInterface<PaymentModel> = {
      collection: 'events',
      condition: { },
      db: 'pos',
      sort: {
        updatedAt: 1,
      },
      target: 'events',
    };
    const lastDoc: StatisticsEventsModel = await this.posEvents.findOne().sort({ updatedAt: -1 }).exec();

    if (lastDoc) {
      options.condition = {
        updatedAt: {
          $gt: lastDoc.updatedAt,
        },
      };
    }

    const batch: EventsInterface[] = [];

    const dataStream: AsyncGenerator<EventsInterface> = await this.loader.getData(SourceEnum.Mongodb, options);

    let total: number = 0;

    const processBatch: () => Promise<void> = async (): Promise<void> => {
      await Promise.all(batch.map((posEvent: EventsInterface) => {
        return this.posEvents.deleteMany({ applicationId: posEvent.applicationId, createdAt: posEvent.createdAt });
      }));
      const aggregatedBatch: StatisticsEventsInterface[] = this.getAggregatedBatch(batch);

      await this.posEvents.insertMany(aggregatedBatch);

      this.logger.log(`updatePosMetrics: batch done with ${batch.length}`);
      batch.length = 0;
    };

    for await (const sourcePayment of dataStream) {
      if (batch.length > BATCH_SIZE) {
        await processBatch();
      }
      batch.push(sourcePayment);
      total++;
    }
    await processBatch();

    this.logger.log(`updatePosMetrics: ${total}`);
  }

  public async importSubscriptions(): Promise<void> {
    const options: MongodbOptionsInterface<PaymentModel> = {
      batchSize: BATCH_SIZE,
      collection: 'events',
      condition: { },
      db: 'billing-subscription',
      sort: {
        createdAt: 1,
      },
      target: 'events',
    };
    const lastDoc: StatisticsEventsModel =
    await this.subscriptionsEvents.findOne().sort({ createdAt: -1 }).exec();

    if (lastDoc) {
      options.condition = {
        createdAt: {
          $gt: lastDoc.createdAt,
        },
      };
    }

    const batch: EventsInterface[] = [];

    const dataStream: AsyncGenerator<EventsInterface> =
      await this.loader.getData<EventsInterface>(SourceEnum.Mongodb, options);

    let total: number = 0;

    const processBatch: () => Promise<void> = async (): Promise<void> => {
      const aggregatedBatch: StatisticsEventsInterface[] = this.getAggregatedBatch(batch);
      await this.subscriptionsEvents.insertMany(aggregatedBatch);
      this.logger.log(`importSubscriptionsMetrics: batch done with ${batch.length}`);
      batch.length = 0;
    };

    for await (const sourcePayment of dataStream) {
      if (batch.length > BATCH_SIZE) {
        await processBatch();
      }
      batch.push(sourcePayment);
      total++;
    }
    await processBatch();

    this.logger.log(`importSubscriptionsMetrics: ${total}`);
  }

  public async updateSubscriptions(): Promise<void> {
    const options: MongodbOptionsInterface<PaymentModel> = {
      collection: 'events',
      condition: { },
      db: 'billing-subscription',
      sort: {
        updatedAt: 1,
      },
      target: 'events',
    };
    const lastDoc: StatisticsEventsModel =
    await this.subscriptionsEvents.findOne().sort({ updatedAt: -1 }).exec();

    if (lastDoc) {
      options.condition = {
        updatedAt: {
          $gt: lastDoc.updatedAt,
        },
      };
    }

    const batch: EventsInterface[] = [];

    const dataStream: AsyncGenerator<EventsInterface> =
    await this.loader.getData(SourceEnum.Mongodb, options);

    let total: number = 0;

    const processBatch: () => Promise<void> = async (): Promise<void> => {
      await Promise.all(batch.map((subscriptionsEvent: EventsInterface) => {
        return this.subscriptionsEvents.deleteMany({ applicationId: subscriptionsEvent.applicationId,
           createdAt: subscriptionsEvent.createdAt });
      }));
      const aggregatedBatch: StatisticsEventsInterface[] = this.getAggregatedBatch(batch);

      await this.subscriptionsEvents.insertMany(aggregatedBatch);

      this.logger.log(`updateSubscriptionsMetrics: batch done with ${batch.length}`);
      batch.length = 0;
    };

    for await (const sourcePayment of dataStream) {
      if (batch.length > BATCH_SIZE) {
        await processBatch();
      }
      batch.push(sourcePayment);
      total++;
    }
    await processBatch();

    this.logger.log(`updateSubscriptionsMetrics: ${total}`);
  }

  public async importMessages(): Promise<void> {
    const options: MongodbOptionsInterface<PaymentModel> = {
      batchSize: BATCH_SIZE,
      collection: 'events',
      condition: { },
      db: 'marketing',
      sort: {
        createdAt: 1,
      },
      target: 'events',
    };
    const lastDoc: StatisticsEventsModel = await this.messageEvents.findOne().sort({ createdAt: -1 }).exec();

    if (lastDoc) {
      options.condition = {
        createdAt: {
          $gt: lastDoc.createdAt,
        },
      };
    }

    const batch: EventsInterface[] = [];

    const dataStream: AsyncGenerator<EventsInterface> =
      await this.loader.getData<EventsInterface>(SourceEnum.Mongodb, options);

    let total: number = 0;

    const processBatch: () => Promise<void> = async (): Promise<void> => {
      const aggregatedBatch: StatisticsEventsInterface[] = this.getAggregatedBatch(batch);
      await this.messageEvents.insertMany(aggregatedBatch);
      this.logger.log(`importMessageMetrics: batch done with ${batch.length}`);
      batch.length = 0;
    };

    for await (const sourcePayment of dataStream) {
      if (batch.length > BATCH_SIZE) {
        await processBatch();
      }
      batch.push(sourcePayment);
      total++;
    }
    await processBatch();

    this.logger.log(`importMessageMetrics: ${total}`);
  }

  public async updateMessages(): Promise<void> {
    const options: MongodbOptionsInterface<PaymentModel> = {
      collection: 'events',
      condition: { },
      db: 'marketing',
      sort: {
        updatedAt: 1,
      },
      target: 'events',
    };
    const lastDoc: StatisticsEventsModel = await this.messageEvents.findOne().sort({ updatedAt: -1 }).exec();

    if (lastDoc) {
      options.condition = {
        updatedAt: {
          $gt: lastDoc.updatedAt,
        },
      };
    }

    const batch: EventsInterface[] = [];

    const dataStream: AsyncGenerator<EventsInterface> =
     await this.loader.getData(SourceEnum.Mongodb, options);

    let total: number = 0;

    const processBatch: () => Promise<void> = async (): Promise<void> => {
      await Promise.all(batch.map((messageEvent: EventsInterface) => {
        return this.messageEvents.deleteMany({ applicationId: messageEvent.applicationId,
          createdAt: messageEvent.createdAt });
      }));
      const aggregatedBatch: StatisticsEventsInterface[] = this.getAggregatedBatch(batch);

      await this.messageEvents.insertMany(aggregatedBatch);

      this.logger.log(`updateMessageMetrics: batch done with ${batch.length}`);
      batch.length = 0;
    };

    for await (const sourcePayment of dataStream) {
      if (batch.length > BATCH_SIZE) {
        await processBatch();
      }
      batch.push(sourcePayment);
      total++;
    }
    await processBatch();

    this.logger.log(`updateMessageMetrics: ${total}`);
  }

  public async importBlog(): Promise<void> {
    const options: MongodbOptionsInterface<PaymentModel> = {
      batchSize: BATCH_SIZE,
      collection: 'events',
      condition: { },
      db: 'blog',
      sort: {
        createdAt: 1,
      },
      target: 'events',
    };
    const lastDoc: StatisticsEventsModel = await this.blogEvents.findOne().sort({ createdAt: -1 }).exec();

    if (lastDoc) {
      options.condition = {
        createdAt: {
          $gt: lastDoc.createdAt,
        },
      };
    }

    const batch: EventsInterface[] = [];

    const dataStream: AsyncGenerator<EventsInterface> =
      await this.loader.getData<EventsInterface>(SourceEnum.Mongodb, options);

    let total: number = 0;

    const processBatch: () => Promise<void> = async (): Promise<void> => {
      const aggregatedBatch: StatisticsEventsInterface[] = this.getAggregatedBatch(batch);
      await this.blogEvents.insertMany(aggregatedBatch);
      this.logger.log(`importBlogMetrics: batch done with ${batch.length}`);
      batch.length = 0;
    };

    for await (const sourcePayment of dataStream) {
      if (batch.length > BATCH_SIZE) {
        await processBatch();
      }
      batch.push(sourcePayment);
      total++;
    }
    await processBatch();

    this.logger.log(`importBlogMetrics: ${total}`);
  }

  public async updateBlog(): Promise<void> {
    const options: MongodbOptionsInterface<PaymentModel> = {
      collection: 'events',
      condition: { },
      db: 'blog',
      sort: {
        updatedAt: 1,
      },
      target: 'events',
    };
    const lastDoc: StatisticsEventsModel = await this.blogEvents.findOne().sort({ updatedAt: -1 }).exec();

    if (lastDoc) {
      options.condition = {
        updatedAt: {
          $gt: lastDoc.updatedAt,
        },
      };
    }

    const batch: EventsInterface[] = [];

    const dataStream: AsyncGenerator<EventsInterface> =
     await this.loader.getData(SourceEnum.Mongodb, options);

    let total: number = 0;

    const processBatch: () => Promise<void> = async (): Promise<void> => {
      await Promise.all(batch.map((blogEvent: EventsInterface) => {
        return this.blogEvents.deleteMany({ applicationId: blogEvent.applicationId,
          createdAt: blogEvent.createdAt });
      }));
      const aggregatedBatch: StatisticsEventsInterface[] = this.getAggregatedBatch(batch);

      await this.blogEvents.insertMany(aggregatedBatch);

      this.logger.log(`updateBlogMetrics: batch done with ${batch.length}`);
      batch.length = 0;
    };

    for await (const sourcePayment of dataStream) {
      if (batch.length > BATCH_SIZE) {
        await processBatch();
      }
      batch.push(sourcePayment);
      total++;
    }
    await processBatch();

    this.logger.log(`updateBlogMetrics: ${total}`);
  }

  public async importTransactions(): Promise<void> {
    const options: MongodbOptionsInterface<PaymentModel> = {
      batchSize: BATCH_SIZE,
      collection: 'payments',
      condition: { },
      sort: {
        createdAt: 1,
      },

      db: 'checkout-analytics',
      target: 'payments',
    };
    const lastDoc: PaymentModel = await this.paymentModel.findOne().sort({ createdAt: -1 }).exec();

    if (lastDoc) {
      options.condition = {
        createdAt: {
          $gt: lastDoc.createdAt,
        },
      };
    }

    const batch: PaymentLeanDocument[] = [];

    const dataStream: AsyncGenerator<PaymentLeanDocument> =
      await this.loader.getData<PaymentLeanDocument>(SourceEnum.Mongodb, options);

    let total: number = 0;
    const processBatch: () => Promise<void> = async (): Promise<void> => {
      const existPayments: PaymentModel[] = await this.paymentModel.find({
        _id: {
          $in: batch.map((batchPayment: PaymentLeanDocument) => batchPayment._id),
        },
      });
      const existsIds: string[] = existPayments.map((existPayment: PaymentModel) => existPayment._id);
      const paymentsToInsert: PaymentLeanDocument[] = batch.filter(
        (batchPayment: PaymentLeanDocument) => !existsIds.includes(batchPayment._id),
      );
      const paymentsWithBusinessToInsert: PaymentLeanDocument[] = await Promise.all(
        paymentsToInsert.map(async (paymentToInsert: PaymentLeanDocument) => {
          return {
            ...paymentToInsert,
            status: paymentToInsert.status ?? 'STATUS_NEW',
          };
        }));
        
      try {
        await this.paymentModel.insertMany(paymentsWithBusinessToInsert);
        this.logger.log(`importTransactions: batch done with ${batch.length}`);
      } catch (error) {
        this.logger.warn(
          {
            error: error.message,
            message: 'Failed to import batch transactions',
          }
        ); 
      }
      batch.length = 0;

    };

    for await (const sourcePayment of dataStream) {
      if (batch.length > BATCH_SIZE) {
        await processBatch();
      }
      batch.push(sourcePayment);
      total++;
    }
    await processBatch();
    await this.updateMetrics(lastDoc, true);
    this.logger.log(`importTransactions: ${total}`);
  }

  public async updateTransactions(): Promise<void> {
    const options: MongodbOptionsInterface<PaymentModel> = {
      collection: 'payments',
      condition: { },
      sort: {
        updatedAt: 1,
      },

      db: 'checkout-analytics',
      target: 'payments',
    };
    const lastDoc: PaymentModel = await this.paymentModel.findOne().sort({ updatedAt: -1 }).exec();

    if (lastDoc) {
      options.condition = {
        updatedAt: {
          $gt: lastDoc.updatedAt,
        },
      };
    }

    const batch: PaymentLeanDocument[] = [];

    const dataStream: AsyncGenerator<PaymentLeanDocument> = await this.loader.getData(SourceEnum.Mongodb, options);

    let total: number = 0;

    const processBatch: () => Promise<void> = async (): Promise<void> => {
      const existPayments: PaymentModel[] = await this.paymentModel.find({
        _id: {
          $in: batch.map((batchPayment: PaymentLeanDocument) => batchPayment._id),
        },
      });
      const existsIds: string[] = existPayments.map((existPayment: PaymentModel) => existPayment._id);
      await Promise.all(existsIds.map((existsId: string) => {
        const sourcePayment: PaymentLeanDocument = batch.find(
          (sourcePaymentItem: PaymentLeanDocument) => sourcePaymentItem._id === existsId,
        );

        return this.paymentModel.updateOne({
          _id: existsId,
        }, {
          $set: {
            ...sourcePayment,
          },
        });
      }));
      this.logger.log(`updateTransactions: batch done with ${batch.length}`);
      batch.length = 0;
    };

    for await (const sourcePayment of dataStream) {
      if (batch.length > BATCH_SIZE) {
        await processBatch();
      }
      batch.push(sourcePayment);
      total++;
    }
    await processBatch();

    await this.updateMetrics(lastDoc, false);
    this.logger.log(`updateTransactions: ${total}`);
  }

  public async updateMetrics(lastDoc: PaymentModel, created: boolean): Promise<void> {
    const optionsMetrics: MongodbOptionsInterface<PaymentModel> = {
      collection: 'checkoutmetrics',
      condition: {
        newPaymentId: {
          $exists: 1,
          $ne: null,
        },
      },
      db: 'checkout-analytics',
      target: 'checkoutmetrics',
    };

    if (lastDoc) {
      optionsMetrics.condition = created ? {
        ...optionsMetrics.condition,
        createdAt: {
          $gt: lastDoc.createdAt,
        },
      } : {
        ...optionsMetrics.condition,
        updatedAt: {
          $gt: lastDoc.updatedAt,
        },
      };
      optionsMetrics.sort = created ? {
        createdAt: 1,
      } : {
        updatedAt: 1,
      };
    }

    const processBatch: () => Promise<void> = async (): Promise<void> => {
      const existsPayments: PaymentModel[] = await this.paymentModel.find({
        _id: {
          $in: batch.map((item: CheckoutMetricsLeanDocument) => item.newPaymentId),
        },
      });

      await Promise.all(existsPayments.map((existPayment: PaymentModel) => {
        const metric: CheckoutMetricsLeanDocument = batch.find(
          (metricItem: CheckoutMetricsLeanDocument) => metricItem.newPaymentId === existPayment._id,
        );

        return this.paymentModel.updateOne({
          _id: existPayment._id,
        }, {
          $set: {
            browser: metric.browser,
            device: metric.device,
          },
        });
      }));

      batch.length = 0;
    };

    const batch: CheckoutMetricsLeanDocument[] = [];

    const dataStream: AsyncGenerator<CheckoutMetricsLeanDocument> =
      await this.loader.getData<CheckoutMetricsLeanDocument>(SourceEnum.Mongodb, optionsMetrics);


    for await (const sourceMetric of dataStream) {
      if (batch.length > BATCH_SIZE) {
        await processBatch();
      }
      batch.push(sourceMetric);
    }
    await processBatch();
  }

  private getAggregatedBatch(batch: EventsInterface[]): StatisticsEventsInterface[] {
    return batch.reduce(
      (acc: any, curr: EventsInterface) => {
        const aggregate: StatisticsEventsInterface[] = curr.customMetrics ? curr.customMetrics.map((metrics: any) => {
          return {
            applicationId: curr.applicationId,
            browser: metrics.browser,
            businessId: curr.businessId,
            clientId: metrics.clientId,
            createdAt: curr.createdAt,
            device: metrics.device,
            element: metrics.element,
            sessionId: curr.sessionId,
            type: metrics.type,
            updatedAt: curr.updatedAt,
            url: metrics.url,
          };
        })
        : [];
        acc.push(...aggregate);

        return acc;
      },
      [],
    );
  }
}

