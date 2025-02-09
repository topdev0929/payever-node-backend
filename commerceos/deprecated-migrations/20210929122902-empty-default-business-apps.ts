const key: string = 'business';

export async function up(db: any): Promise<void> {
  await db._run(
    'update',
    'defaultapps',
    {
      query: {
        _id: key,
      },

      update: {
        installedApps: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      options: {
        upsert: true,
      },
    },
  );

  return null;
}

export async function down(): Promise<void> {
  return null;
}
