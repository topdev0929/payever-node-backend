// tslint:disable:object-literal-sort-keys
import { MongoClient, Db, Collection } from 'mongodb';
import { Document } from 'mongoose';
import { BaseMigration } from '@pe/migration-kit';

import { ChannelSetModel } from '../src/channel-set';

const MESSAGE_INTERNAL_CHANNEL_ID: string = '1f631aeb-1ba7-4517-a133-a3527a028785';

interface MessageChannel extends Document<string> {
  enabledByDefault: boolean;
}

export class FixMessageInternalChannelSets extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const messageConnection: Db = mongoClient.db('message');
    const messageChannelsCollection: Collection = messageConnection.collection('channels');
    const messageBusinessesCollection: Collection = messageConnection.collection('businesses');

    const productsChannelSetsCollection: Collection<ChannelSetModel> = this.connection.collection('channelsets');
    const messageInternalChannel: MessageChannel = await messageChannelsCollection
      .findOne({ _id: MESSAGE_INTERNAL_CHANNEL_ID, type: 'internal' });
    if (!messageInternalChannel) { throw new Error('Internal channel missing'); }

    // 1. Find all channel-sets with type === 'internal' in business app
    const messageInternalChannelSets: Array<{ businessId: string; channelSetId: string; }> =
      await messageBusinessesCollection.aggregate([
        {
          '$unwind': {
            'path': '$channelSets',
            'includeArrayIndex': '_itemIndex',
            'preserveNullAndEmptyArrays': false,
          },
        }, {
          '$project': {
            'channelSetId': '$channelSets',
          },
        }, {
          '$lookup': {
            'from': 'channelsets',
            'localField': 'channelSetId',
            'foreignField': '_id',
            'as': 'channelSet',
          },
        }, {
          '$unwind': {
            'path': '$channelSet',
            'includeArrayIndex': '_itemIndex',
            'preserveNullAndEmptyArrays': false,
          },
        }, {
          '$match': {
            'channelSet.channel': MESSAGE_INTERNAL_CHANNEL_ID,
          },
        }, {
          '$project': {
            'businessId': '$_id',
            'channelSetId': '$channelSetId',
          },
        },
      ]).toArray();

    // 2) Update all channel-sets
    for (const item of messageInternalChannelSets) {
      await productsChannelSetsCollection.updateOne(
        {
          _id: item.channelSetId,
        },
        {
          $set: {
            type: 'internal',
            enabledByDefault: messageInternalChannel.enabledByDefault,
            businessId: item.businessId,
          },
        },
        {
          upsert: false,
        },
      );
    }
  }
  public async down(): Promise<void> { }
  public description(): string {
    return `Restore businessId field for internal type channelsets created by message app`;
  }
  public migrationName(): string {
    return FixMessageInternalChannelSets.name;
  }
  public version(): number {
    return 1;
  }
}
