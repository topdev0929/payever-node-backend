import { BaseMigration } from '@pe/migration-kit';
import { Cursor } from 'mongodb';

export class SampleProducts extends BaseMigration {

  public async up(): Promise<void> {

    const products: Cursor = this.connection.collection('products').find(
      { $and: [ { channelSets: { $ne: []}} , { channelSets: { $ne: null}}]},
    );

    for (let product: any = await products.next(); product !== null; product = await products.next()) {
      const channelSets: string[] = [];
      for (const channel of product.channelSets) {
        channelSets.push(channel.id);

        const channelSet: any = await this.connection.collection('channelsets').findOne({
          _id: channel.id,
        });
        if (!channelSet) {
          await this.connection.collection('channelsets').insertOne({
            _id: channel.id,
            business: product.businessUuid,
            name: channel.name,
            type: channel.type,
          });
        }

      }
      await this.connection.collection('products').findOneAndUpdate(
        { '_id': product._id},
        {
          $set: {
            channelSets: channelSets,
          },
        },
      );
    }
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return '';
  }

  public migrationName(): string {
    return 'ChannelSetProduct';
  }

  public version(): number {
    return 1;
  }
}
