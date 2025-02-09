const { HeadlinesRules, HeadlineFolders } = require('../fixtures/headline-rules.fixture');

module.exports.up = async (db) => {
  await db._run(
    'update',
    'folders',
    {
      query: {
        parentFolderId: null,
        name: '/',
        scope: 'default',
      },
      update: {
        $setOnInsert: {
          _id: 'de64d148-b296-4624-ac8b-9a972a0b9bb7',
        },
        $set: {
          description: `Root folder`,
        },
      },
      options: {
        upsert: true,
      },
    },
  );

  const [defaultScopeRootFolder] = await db._run(
    'find',
    'folders',
    {
      parentFolderId: null,
      name: '/',
      scope: 'default',
    },
  );
  if (!defaultScopeRootFolder) {
    throw new Error(`No default scope root folder yet`);
  }

  for (const folder of HeadlineFolders) {
    await db._run(
      'update',
      'folders',
      {
        query: { _id: folder._id },
        update: {
          $set: {
            ...folder,
            parentFolderId: defaultScopeRootFolder._id,
          },
        },
        options: {
          upsert: true,
        },
      },
    );
  }

  for (const rule of HeadlinesRules) {
    await db._run(
      'update',
      'baserules',
      {
        query: { _id: rule._id },
        update: {
          $set: rule,
        },
        options: {
          upsert: true,
        },
      },
    )
  }
}

// tslint:disable-next-line: no-empty
module.exports.down = async () => { }
