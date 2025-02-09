
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Positional } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { TransactionModel } from '../models';
import { TransactionEventProducer } from '../producer';
import { connect as connectAmqp, Connection, Channel } from 'amqplib';
import { environment } from '../../environments';
import { RabbitRoutingKeys } from '../../enums';
import axios from 'axios';
import { CountQueueInterface, ExchangeBindingInterface } from '../interfaces';

@Injectable()
export class TransactionsExportCommand {

  private rqmConnection: Connection;
  private channelWrapper: Channel;
  private queues: ExchangeBindingInterface[];
  private retryCountListBindings: number = 0;
  private retrySendToExchange: number = 0;

  constructor(
    @InjectModel('Transaction') private readonly transactionsModel: Model<TransactionModel>,
    private readonly transactionEventProducer: TransactionEventProducer,
  ) { }

  @Command({ command: 'transactions:export:bus', describe: 'Export transactions through bus' })
  public async export(
    @Positional({
      name: 'after',
    }) after: string,
    @Positional({
      name: 'before',
    }) before: string,
    @Positional({
      name: 'business',
    }) business_uuid: string,
  ): Promise<void> {
    const criteria: any = { };
    if (before || after) {
      criteria.updated_at = { };
    }
    if (before) {
      criteria.updated_at.$lte = new Date(before);
    }
    if (after) {
      criteria.updated_at.$gte = new Date(after);
    }
    if (business_uuid) {
      criteria.business_uuid = business_uuid;
    }

    await this.createConnection();

    this.queues = await this.listBindings();

    Logger.log(`Criteria is ${JSON.stringify(criteria, null, 2)}.`);

    const total: number = await this.transactionsModel.countDocuments(criteria);
    Logger.log(`Found ${total} records.`);

    const limit: number = 100;
    let processed: number = 0;

    while (processed < total) {
      await this.delay(20000);
      const checkQ: boolean = await this.checkMessagesQueues();
      if (!checkQ) {

        if (this.retrySendToExchange > 10) {
          throw new Error('Queue overload does not allow sending messages.');
        }

        Logger.log(`Queues are not ready to receive messages.`);
        this.retrySendToExchange += 1;
        continue;
      }

      this.retrySendToExchange = 0;

      const transactions: TransactionModel[] = await this.getWithLimit(processed, limit, criteria);
      Logger.log(`Starting next ${transactions.length} transactions.`);

      for (const transaction of transactions) {
        await this.transactionEventProducer.produceTransactionExportEvent(transaction.toObject());
      }
      processed += transactions.length;
      Logger.log(`Exported ${processed} of ${total}.`);
    }
  }

  private async receiveCountMessages(queueName: string): Promise<CountQueueInterface> {
    try {
      return await this.channelWrapper.checkQueue(queueName);
    } catch (error) {
      Logger.error(`Error checking queue: ${error.message}`);
    }
  }

  private async listBindings(): Promise<ExchangeBindingInterface[]> {
    try {
      const response: any = await axios.get(
        `${environment.rabbitmq.managementUrl}/api/exchanges/paf/async_events/bindings/source`,
      );
      if (response.status === 200) {
        const exchanges: ExchangeBindingInterface[] = response.data;

        return exchanges.filter(
          (q: ExchangeBindingInterface) => q.routing_key === RabbitRoutingKeys.TransactionsPaymentExport);
      }
    } catch (error) {
      Logger.error(`Error checking list bindings: ${error.message}`);
      if (this.retryCountListBindings > 10) {
        throw new Error('Error in receiving the list of queues bound to the exchange.!');
      }
      this.retryCountListBindings += 1;
      await this.delay(1000);

      return this.listBindings();
    }
  }

  private async checkMessagesQueues(): Promise<boolean> {
    const resQ: CountQueueInterface[] = await Promise.all(this.queues.map((q: ExchangeBindingInterface) => {

      return this.receiveCountMessages(q.destination);
    }));

    const isNoConsumer: CountQueueInterface[] = resQ.filter((v: any) => v.consumerCount === 0);
    if (isNoConsumer.length > 0) {
      throw new Error(`The queues receive this export but have no consumers. ${JSON.stringify(isNoConsumer)}`);
    }

    return !resQ.some((v: any) => !v || v.messageCount > 10);
  }

  private async createConnection(): Promise<void> {
    this.rqmConnection = await connectAmqp(environment.rabbitmq.urls[0]);
    this.channelWrapper = await this.rqmConnection.createChannel();
  }

  private delay(time: number): Promise<void> {
    return new Promise((res: any, rej: any) => setTimeout(() => res(null), time));
  }

  private async getWithLimit(start: number, limit: number, criteria: any): Promise<any[]> {
    return this.transactionsModel.find(
      criteria,
      null,
      {
        limit: limit,
        skip: start,
        sort: { _id: 1 },
      },
    );
  }
}
