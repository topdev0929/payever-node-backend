export async function up(db: any): Promise<void> {
  try {
    await db.removeIndex('businessactives', 'business_1_owner_1');
  } catch (e) { }

  await db._run('update', 'businessactives', {
    query: { },
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
    await db.removeIndex('trafficsources', 'business_1');
  } catch (e) { }

  await db._run('update', 'trafficsources', {
    query: { },
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

export function down(): void {
  return null;
}
