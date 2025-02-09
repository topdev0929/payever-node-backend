/* tslint:disable:object-literal-sort-keys */
export async function up(db: any): Promise<void> {
  await db._run('update', 'contents', {
    query: {
      business: {
        $exists: true,
      },
    },
    update: {
      $rename: {
        business: 'businessId',
      },
    },
    options: {
      multi: true,
      upsert: false,
    },
  });

  try {
    await db.removeIndex('bubbles', 'business_1');
  } catch (e) { }

  await db._run('update', 'bubbles', {
    query: {
      business: {
        $exists: true,
      },
    },
    update: {
      $rename: {
        business: 'businessId',
      },
    },
    options: {
      multi: true,
      upsert: false,
    },
  });

  try {
    await db.removeIndex('themes', 'business_1');
  } catch (e) { }

  await db._run('update', 'themes', {
    query: {
      business: {
        $exists: true,
      },
    },
    update: {
      $rename: {
        business: 'businessId',
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
