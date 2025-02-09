import { Connection, createConnection } from 'mongoose';

export async function up(db: any): Promise<void> {
  const connection: Connection = await createConnection(db.connectionString, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  });

  const internalDomains = await connection.db
    .collection('terminalaccessconfigs')
    .aggregate(
      [
        {
          '$group': {
            '_id': '$internalDomain',
            'count': {
              '$sum': 1
            }
          }
        },
        {
          '$match': {
            'count': {
              '$gt': 1
            }
          }
        }
      ]
    )
    .toArray();

  for (const internalDomain of internalDomains) {
    const configs = await connection.db
      .collection('terminalaccessconfigs')
      .find({ internalDomain: internalDomain._id })
      .sort({ createdAt: -1 })
      .toArray()
    configs.pop();

    let i = 2;
    for (const config of configs) {
      await connection.db
        .collection('terminalaccessconfigs')
        .findOneAndUpdate(
          {
            _id: config._id,
          },
          {
            $set: {
              internalDomain: `${config.internalDomain}-${i}`,
            }
          }
        );
      i++;
    }
  }
}

export async function down(): Promise<void> { }

module.exports.up = up;
module.exports.down = down;
