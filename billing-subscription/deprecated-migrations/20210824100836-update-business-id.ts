import { createConnection, Connection } from 'mongoose';
import { Logger } from '@nestjs/common';


export async function up(db: { connectionString: string }): Promise<void> {
  const connection: Connection = await createConnection(db.connectionString, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  });

  try {
    await connection.collection('connections').dropIndex('business_1');
    await connection.collection('connections').dropIndex('business_1_integrationName_1');
    await connection.collection('connections').dropIndex('business_1_isEnabled_1');
  } catch (error) {
    Logger.log(error);
  }

  await connection.collection('connections').update(
    {
      business: {
        $exists: true,
      },
    },
    {
      $rename: {
        business: 'businessId',
      },
    },
    {
      multi: true,
      upsert: false,
    },
  );

  //
  await connection.collection('accessconfigs').update(
    {
      business: {
        $exists: true,
      },
    },
    {
      $rename: {
        business: 'businessId',
      },
    },
    {
      multi: true,
      upsert: false,
    },
  );

  try {
    await connection.collection('subscription-plans').dropIndex('business_1');
  } catch (error) {
    Logger.log(error);
  }

  await connection.collection('subscription-plans').update(
    {
      business: {
        $exists: true,
      },
    },
    {
      $rename: {
        business: 'businessId',
      },
    },
    {
      multi: true,
      upsert: false,
    },
  );

  //
  try {
    await connection.collection('plans').dropIndex('business_1');
    await connection.collection('plans').dropIndex('_id_1_business_1');
    await connection.collection('plans').dropIndex('business_1_subscriptionPlan_1');
  } catch (error) {
    Logger.log(error);
  }

  await connection.collection('plans').update(
    {
      business: {
        $exists: true,
      },
    },
    {
      $rename: {
        business: 'businessId',
      },
    },
    {
      multi: true,
      upsert: false,
    },
  );

  await connection.collection('products').update(
    {
      business: {
        $exists: true,
      },
    },
    {
      $rename: {
        business: 'businessId',
      },
    },
    {
      multi: true,
      upsert: false,
    },
  );

  try {
    await connection.collection('subscriptionplans').dropIndex('business_1');
  } catch (error) {
    Logger.log(error);
  }

  await connection.collection('subscriptionplans').update(
    {
      business: {
        $exists: true,
      },
    },
    {
      $rename: {
        business: 'businessId',
      },
    },
    {
      multi: true,
      upsert: false,
    },
  );

  await connection.close();
}

export async function down(): Promise<void> { }
