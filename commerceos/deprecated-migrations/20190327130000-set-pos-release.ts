const collectionName: string = 'dashboardapps';

export async function up(db: any): Promise<void> {
  const posApp: any[] = await db._find(collectionName, { code: 'pos' });

  if (posApp.length) {
    await db._run('update', collectionName, {
      query: {
        _id: posApp[0]._id,
      },
      update: {
        $set: {
          release: 'Beta',
        },
      },
    });
  }
}
