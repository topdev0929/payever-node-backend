import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as jsonpack from 'jsonpack/main';
import * as uuid from 'uuid';

dotenv.config();

const themeAction: string = 'themeactions';
const themeActionEffect: string = 'themeactioneffects';

/** @deprecated */
export async function up(db: any): Promise<void> {
  const client: any = new MongoClient(db.connectionString);
  await client.connect();
  const shopDb: any = await client.db();

  const actions: any[] = await shopDb.collection(themeAction).find({ packedEffects : { $exists : true }}).toArray();

  for (const action of actions) {
    const effects: any = jsonpack.unpack(action.packedEffects);
    const ids: string[] = [];

    for (const effect of effects) {
      const id: string = uuid.v4();
      ids.push(id);
      await shopDb.collection(themeActionEffect).findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            _id: id,
            ...effect,
          },
        },
        {
          upsert: true,
        },
      );
    }
    await shopDb.collection(themeAction).findOneAndUpdate(
      { _id: action._id },
      {
        $set: {
          effectsRef: ids,
        },
        $unset: {
          packedEffects: '',
        },
      },
    );
  }

  await client.close();

  return null;
}
