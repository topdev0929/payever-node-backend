import { FolderInterface } from '@pe/folders-plugin';
import { Db, Collection } from 'mongodb';
import { HeadlinesRules, HeadlineFolders } from '../fixtures/headline-rules.fixture';

module.exports.up = async (db: any) => {
  for (const folder of HeadlineFolders) {
    await db._run(
      'remove',
      'folders',
      {
        _id: folder._id,
      },
    );
  }

  for (const rule of HeadlinesRules) {
    await db._run(
      'remove',
      'baserules',
      {
        _id: rule._id,
      },
    );
  }

  const instance: Db = await db._run('getDbInstance');
  const collection: Collection = instance.collection('folderitemlocations');
  await collection.deleteMany({
    folderId: {
      $in: HeadlineFolders.map((f: FolderInterface) => f._id),
    },
  });
};

// tslint:disable-next-line: no-empty
module.exports.down = async () => { };

// tslint:disable
/**
 * Run by hand elastic search request
 * POST /folder_chats/_delete_by_query
 */
const payload = {
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "_id": "9d9d7696-720d-4938-9281-96c01bdb9905"
          }
        },
        {
          "match": {
            "_id": "8e79ce43-4a84-4fb7-b008-02f626b6d14b"
          }
        },
        {
          "match": {
            "_id": "8073cd97-36e6-41be-8145-98030f6934b9"
          }
        },
        {
          "match": {
            "parentFolderId": "9d9d7696-720d-4938-9281-96c01bdb9905"
          }
        },
        {
          "match": {
            "parentFolderId": "8e79ce43-4a84-4fb7-b008-02f626b6d14b"
          }
        },
        {
          "match": {
            "parentFolderId": "8073cd97-36e6-41be-8145-98030f6934b9"
          }
        }
      ]
    }
  }
}
