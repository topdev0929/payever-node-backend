'use strict';

import { BaseMigration } from '@pe/migration-kit';

const paymentLinksCollection: string = 'paymentlinks';

export class RestructurePaymentLinksMigration extends BaseMigration {

  public async up(): Promise<void> {
    const paymentLinks: any[] = await this.connection.collection(paymentLinksCollection).find({}).toArray();
    
    for (const paymentLink of paymentLinks) {
      
      const updateData: any = {
        channel: paymentLink.channel?.name || undefined,
        channel_type: paymentLink.channel?.type || undefined,
        channel_source: paymentLink.channel?.source || undefined,
        channel_set_id: paymentLink.channel?.channel_set_id || undefined,
        
        salutation: paymentLink.billing_address?.salutation || undefined,
        first_name: paymentLink.billing_address?.first_name || undefined,
        last_name: paymentLink.billing_address?.last_name || undefined,
        street: paymentLink.billing_address?.street || undefined,
        street_name: paymentLink.billing_address?.street_name || undefined,
        street_number: paymentLink.billing_address?.street_number || undefined,
        zip: paymentLink.billing_address?.zip || undefined,
        region: paymentLink.billing_address?.region || undefined,
        country: paymentLink.billing_address?.country || undefined,
        city: paymentLink.billing_address?.city || undefined,
        address_line_2: paymentLink.billing_address?.address_line_2 || undefined,
      }
      
      for (const key of Object.keys(updateData)) {
        if ((updateData[key] === undefined) || (updateData[key] === null)) {
          delete updateData[key]
        }
      }
      
      await this.connection.collection(paymentLinksCollection).updateOne(
        {
          _id: paymentLink._id,
        },
        {
          $unset: {
            billing_address: '',
            channel: '',
          }
        },
      );
      
      await this.connection.collection(paymentLinksCollection).updateOne(
        {
          _id: paymentLink._id,
        },
        {
          $set: updateData,
        },
      );
      
    }
    
    return null;
  };

  public async down(): Promise<void> {
    return null;
  };

  public description(): string {
   return 'Restructure Payment Links';
  };

  public migrationName(): string {
   return 'RestructurePaymentLinksMigration';
  };

  public version(): number {
   return 5;
  };
}
