import * as uuid from 'uuid';

async function up(db: any): Promise<any> {
  const businessIds: any[] = await db._find(
    'businesses',
    { mediaItems: { $exists: true, $not: { $size: 0 } } },
    { _id: 1 },
  ).map((b: any) => b._id);

  for (const businessId of businessIds) {
    const business: any = (await db._find('businesses', { _id: businessId }))[0];
    const mediaItems: any = business.mediaItems || [];

    if (!mediaItems || mediaItems.length === 0) {
      continue;
    }

    for (const mediaItem of mediaItems) {

      const originalMediaItemId: string = mediaItem._id;
      if (!originalMediaItemId) {
        continue;
      }

      const existingMediaItem: any = (await db._find(
        'mediaitems',
        { name: mediaItem.name, container: mediaItem.container },
      ))[0];

      if (existingMediaItem) {
        mediaItem._id = existingMediaItem._id;
      }

      const id: string = mediaItem._id || uuid.v4();

      delete mediaItem._id;

      await db._run("update", "mediaitems", {
        options: { upsert: true, new: true },
        query: { _id: id },
        update: { $set: mediaItem, $setOnInsert: { _id: id } },
      });

      const mediaItemRelation: any = {
        entityId: business._id,
        entityType: 'BusinessModel',
        mediaItem: mediaItem._id,
      };

      const existinRelation: any = (await db._find('mediaitemrelations', mediaItemRelation))[0];

      await db._run("update", "mediaitemrelations", {
        options: { upsert: true },
        query: mediaItemRelation,
        update: {
          $set: {
            ...mediaItemRelation,
          },
          $setOnInsert: {
            _id: existinRelation?._id || uuid.v4(),
          },
        },
      });

      await db._run(
        'update',
        'businesses',
        {
          options: { upsert: true },
          query: { _id: business._id },
          update: {
            $pull: { mediaItems: { _id: originalMediaItemId } },
          },
        },
      );
    }
  }

  return null;
}

async function down(): Promise<any> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
