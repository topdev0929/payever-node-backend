export async function up(db: any): Promise<void> {
  const widgetsCollection: string = 'widgets';
  const installByDefaultWidgets: string[] =
    ['checkout', 'transactions', 'connect', 'shop', 'settings', 'tutorial', 'apps', 'pos', 'products'];

  await db._run('updateMany', widgetsCollection, {
    query: { },
    update: { $set: { installByDefault: false }},
  });

  for (const defaultWidget of installByDefaultWidgets) {
    await db._run('update', widgetsCollection, {
      query: {
        type: defaultWidget,
      },
      update: {
        $set: { installByDefault: true },
      },
    });
  }

  return null;
}

export async function down(db: any): Promise<any> {
  return null;
}

module.exports.up = up;
module.exports.down = down;

