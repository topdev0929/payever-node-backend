import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Option } from '@pe/nest-kit';
import { Model, Query, QueryCursor } from 'mongoose';
import { RMQEventsProducer } from '../producers/rmq-events.producer';
import { RMQEventsEnum } from '../enums';
import { AbstractMessaging, AbstractMessagingDocument } from '../submodules/platform';

@Injectable()
export class WidgetDataExportCommand {
  constructor(
    @InjectModel(AbstractMessaging.name) private readonly chatModel: Model<AbstractMessagingDocument>,
    private readonly widgetDataRabbitEventsProducer: RMQEventsProducer,
  ) { }

  @Command({
    command: 'widgetData:export [--uuid] [--after] [--chat-type-filter]',
    describe: 'Export widgetData through the bus',
  })
  public async widgetDataExport(
    @Option({
      name: 'uuid',
    }) chatId?: string,
    @Option({
      name: 'after',
    }) after?: string,
    @Option({
      name: 'chat-type-filter',
    }) chatTypeFilter?: string,
  ): Promise<void> {
    const chatTypes: string[] = JSON.parse(chatTypeFilter || '[]');

    const criteria: any = { };
    if (chatId) {
      criteria._id = chatId;
    }
    if (after) {
      criteria.createdAt = { };
      criteria.createdAt.$gte = new Date(after);
    }
    if (chatTypes.length) {
      criteria.type = { $in: chatTypes };
    }

    const query: Query<AbstractMessagingDocument[], AbstractMessagingDocument> = this.chatModel.find(criteria);

    Logger.log({
      criteria,
      message: `Start chats export`,
    });

    const total: number = await this.chatModel.countDocuments(criteria).exec();
    Logger.log(`Found ${total} records.`);

    const fetchDocumentsCursor: QueryCursor<AbstractMessagingDocument> = query.cursor({ batchSize: 250 });

    let exported: number = 0;

    await fetchDocumentsCursor.eachAsync(async (document: AbstractMessagingDocument) => {
      await this.widgetDataRabbitEventsProducer.produceWidgetDataUpdatedEvent(
        document,
        RMQEventsEnum.WidgetDataExported,
      );
      exported++;
      Logger.log(`Exported ${exported} of ${total} records.`);
    });
  }
}
