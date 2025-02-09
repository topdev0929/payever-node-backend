import { createConnection, Connection } from 'mongoose';
import { Logger } from '@nestjs/common';


export async function up(db: { connectionString: string }): Promise<void> {
  const connection: Connection = await createConnection(db.connectionString, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  });

  try {
    await connection.collection('accessconfigs').dropIndex('internalDomain_1');
    await connection.collection('accessconfigs').dropIndex('business_1');
  } catch (error) {
    Logger.log(error);
  } finally {
    await connection.close();
  }
}

export async function down(): Promise<void> { }
