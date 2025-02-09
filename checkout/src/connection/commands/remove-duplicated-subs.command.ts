import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { BusinessIntegrationSubModel } from '../../integration/models';
import { BusinessIntegrationSubSchemaName } from '../../mongoose-schema';

/**
 * This command has sense only while Checkouts have their own Subscriptions
 */
@Injectable()
export class RemoveDuplicatedSubsCommand {
  constructor(
    @InjectModel(BusinessIntegrationSubSchemaName) private subscriptionModel: Model<BusinessIntegrationSubModel>,
  ) { }

  @Command({
    command: 'business:subs:remove-duplicated',
    describe: 'Remove duplicated subs from businesses.',
  })
  public async update(): Promise<void> {
    const criteria: any = { };

    const total: number = await this.subscriptionModel.countDocuments(criteria);
    const limit: number = 1000;
    let processed: number = 0;

    while (processed < total) {
      const subs: BusinessIntegrationSubModel[] = await this.getWithLimit(processed, limit, criteria);
      Logger.log(`Starting next ${subs.length} subscriptions.`);
      for (const sub of subs) {
        await sub.populate('integration').execPopulate();
        await sub.populate('business').execPopulate();

        const duplicates: BusinessIntegrationSubModel[] = await this.findDuplicates(sub);
        for (const duplicate of duplicates) {
          if (sub.enabled === false && duplicate.enabled === true) {
            await this.subscriptionModel.updateOne(
              {
                _id: sub.id,
              },
              {
                enabled: true,
              },
            );
          }

          await this.subscriptionModel.findByIdAndRemove(duplicate.id);
        }

      }

      processed += subs.length;
    }

    Logger.log(`Processed ${processed} of ${total}.`);
  }

  private async findDuplicates(
    subscription: BusinessIntegrationSubModel,
  ): Promise<BusinessIntegrationSubModel[]> {
    return this.subscriptionModel.find({
      _id: {
        $ne: subscription.id,
      },
      businessId: subscription.business.id,
      integration: subscription.integration.id,
    });
  }

  private async getWithLimit(
    start: number,
    limit: number,
    criteria: any = { },
  ): Promise<BusinessIntegrationSubModel[]> {
    return this.subscriptionModel.find(
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
