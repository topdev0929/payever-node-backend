import { createConnection, Model, Document, Connection, ClientSession } from 'mongoose';
import { SubscriptionPlanSchema, SubscriptionPlanSchemaName } from '../src/subscriptions/schemas';

import { AggregationCursor } from 'mongodb';
import * as uuid from 'uuid';

export async function up(db: { connectionString: string }): Promise<void> {
  const connection: Connection = await createConnection(db.connectionString, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  });
  try {
    await connection.collection('subscriptionplans').drop();
  } catch { }

  initModel();

  try {
    await connection.createCollection('subscriptionplans');
    await connection.collection('plans').dropIndex('product_1_paymentMethod_1');
  } catch { }

  try {
    const session: ClientSession = await connection.startSession();
    await session.withTransaction(async () => {
      await groupPlanConnection(session);
    });
  } catch (error) {
    throw new Error(error);
  } finally {
    await connection.close();
  }

  function initModel(): void {
    connection.model(SubscriptionPlanSchemaName, SubscriptionPlanSchema, 'subscriptionplans');
  }

  async function groupPlanConnection(session: ClientSession): Promise<void> {
    const plansGroupedCursor: AggregationCursor<any> = connection.collection('plans').aggregate([
      {
        $group: {
          _id: { business: '$business', interval: '$interval', planType: '$planType', billingPeriod: '$billingPeriod' },
          plans: { $push: { planId: '$$ROOT._id', productId: '$$ROOT.product', name: '$$ROOT.name' } },
        },
      },
    ]);

    while (await plansGroupedCursor.hasNext()) {
      const planGrouped: any = await plansGroupedCursor.next();

      for (const plan of planGrouped.plans) {
        const subscriptionPlan: any = {
          _id: uuid.v4(),
          billingPeriod: planGrouped._id.billingPeriod,
          business: planGrouped._id.business,
          interval: planGrouped._id.interval,
          name: plan.name,
          planType: planGrouped._id.planType,
          product: plan.productId,
        };
        await connection.collection('subscriptionplans').insertOne(subscriptionPlan, { session });

        await connection.collection('plans').updateOne(
          { _id: plan.planId },
          {
            $set: {
              subscriptionPlan: subscriptionPlan._id,
            },
            $unset: {
              billingPeriod: 1,
              interval: 1,
              name: 1,
              planType: 1,
              product: 1,
            },
          },
          { session },
        );
      }
    }
  }
}

export async function down(): Promise<void> { }
