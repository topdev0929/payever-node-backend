import { createConnection, Connection } from 'mongoose';

export async function up(db: { connectionString: string }): Promise<void> {
  const connection: Connection = await createConnection(db.connectionString, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  });
  try {
    await connection.collection('subscriptionplans').rename('subscription-plans');
  } catch {

  } finally {
    await connection.close();
  }

}

export async function down(): Promise<void> { }
