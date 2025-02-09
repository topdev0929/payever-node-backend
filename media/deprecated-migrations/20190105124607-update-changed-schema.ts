import { v4 as uuid } from 'uuid';

async function up(db: any): Promise<any> {
  await db.createCollection('businesses');

  const mediaBusinesses: any = await db._find('mediaschemas', { });

  for (const business of mediaBusinesses) {
    const mediaItems: any[] = [];

    for (const media of business.mediaItems) {
      mediaItems.push({
        _id: uuid(),
        container: media.container,
        createdAt: new Date(),
        name: media.name,
        updatedAt: new Date(),
      });
    }

    await db.insert(
      'businesses',
      {
        __v: 0,
        _id: business.businessUuid,
        createdAt: new Date(),
        mediaItems: mediaItems,
        updatedAt: new Date(),
      },
    );
  }

  return null;
}

async function down(): Promise<any> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
