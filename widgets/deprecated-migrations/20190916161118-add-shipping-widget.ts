import {
  ClientSession,
  Connection,
  createConnection,
  Document,
  Model,
  Schema,
} from 'mongoose';
import * as shippingWidget from '../fixtures/shipping-widget.json';

export async function up(db: { connectionString: string }): Promise<void> {
  const connection: Connection = createConnection(db.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    const session: ClientSession = await connection.startSession();
    await session.withTransaction(
      addShippingWidget.bind(this, connection, session),
    );
  } finally {
    await connection.close();
  }
}

async function addShippingWidget(
  connection: Connection,
  session: ClientSession,
): Promise<void> {
  const widgets: Model<Document> = connection.model(
    'widgets',
    new Schema({ _id: String }, { timestamps: true, strict: false }),
  );
  await widgets.createCollection();
  await widgets
    .updateOne({ _id: shippingWidget._id }, shippingWidget)
    .session(session)
    .setOptions({ upsert: true }, true)
    .exec();
}
