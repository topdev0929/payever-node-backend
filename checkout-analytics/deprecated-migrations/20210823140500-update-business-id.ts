export async function up(db: any): Promise<void> {
  await db._run('update', 'oauthtokens', {
    query: {
      businesses: {
        $exists: true,
      },
    },
    update: {
      $rename: {
        businesses: 'businessIds',
      },
    },
    options: {
      upsert: false,
      multi: true,
    },
  });
}

export function down(): Promise<void> {
  return null;
}
