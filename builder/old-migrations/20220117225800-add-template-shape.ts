import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();
const env: ProcessEnv = process.env;
const applications: string[] = [
  `affiliate`,
  `subscription`,
];

const shapeCollection: string = 'shapes';
const shapeAlbumCollection: string = 'shapealbums';

/** @deprecated: using migrate kit, also obsolete with 20230324192000-add-template-shape.ts */
export async function up(db: any): Promise<void> {
  if (!applications.includes(env.APPLICATION_TYPE)) {
    return null;
  }

  const shapeAlbumsString: string = fs.readFileSync(
    './migrations/data/shape-albums.json',
    'utf-8',
  );
  const shapeString: string = fs.readFileSync(
    './migrations/data/shapes.json',
    'utf-8',
  );
  const shapeAlbums: any = JSON.parse(shapeAlbumsString);
  const shapes: any = JSON.parse(shapeString);

  const client: any = new MongoClient(db.connectionString);
  await client.connect();
  const subscriptionDb: any = await client.db();

  for (const shapeAlbum of shapeAlbums) {
    shapeAlbum.albumType = 'template';
    await upsert(subscriptionDb, shapeAlbumCollection, shapeAlbum);
  }
  for (const shape of shapes) {
    shape.type = 'template';
    await upsert(subscriptionDb, shapeCollection, shape);
  }
}

async function upsert(subscriptionDb: any, collection: string, data: any): Promise<void> {
  const set: any = {
    ...data,
  };

  set.createdAt = new Date();
  set.updatedAt = new Date();
  delete set._id;

  await subscriptionDb.collection(collection).findOneAndUpdate(
    { _id: data._id},
    {
      $set: set,
    },
    { upsert: true },
  );
}
