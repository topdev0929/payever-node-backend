import { defaultMimeTypes } from '../fixtures/default-mime-types.fixture';

async function up(db: any): Promise<any> {

  for (const item of defaultMimeTypes) {
    const existing: any = (await db._find('mimetypes', { _id: item._id }))[0];

    if (!existing) {
      await db._run('insert', 'mimetypes', item);
    }
    else {
      await db._run(
        'update',
        'mimetypes',
        {
          query: { _id: item._id },
          update: { $set: item },
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
