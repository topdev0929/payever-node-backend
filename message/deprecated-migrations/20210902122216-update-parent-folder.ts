/* tslint:disable:object-literal-sort-keys */
export async function up(db: any): Promise<void> {
  try {
    await db.removeIndex('folders', 'name_1_parentFolder_1');
  } catch (e) { }

  await db._run('update', 'folders', {
    query: { },
    update: {
      $rename: {
        business: 'businessId',
        parentFolder: 'parentFolderId',
      },
    },
    options: {
      multi: true,
      upsert: false,
    },
  });

  try {
    await db.removeIndex('chats', 'parentFolder_1');
  } catch (e) { }

  await db._run('update', 'chats', {
    query: {
      parentFolder: {
        $exists: true,
      },
    },
    update: {
      $rename: {
        parentFolder: 'parentFolderId',
      },
    },
    options: {
      multi: true,
      upsert: false,
    },
  });

  return null;
}

export function down(): Promise<void> {
  return null;
}
