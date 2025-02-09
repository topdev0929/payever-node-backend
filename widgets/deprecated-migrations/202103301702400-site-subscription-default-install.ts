export async function up(db: any): Promise<void> {

  await db._run(
    'update',
    'widgets',
    {
      query: { title : 'Sites' },
      update: {
        $set: {
          installByDefault: true,
        },
      },
    },
  );
  await db._run(
    'update',
    'widgets',
    {
      query: { title : 'Subscriptions' },
      update: {
        $set: {
          installByDefault: true,
        },
      },
    },
  );

  return null;
}

export async function down(db: any): Promise<any> {
  return null;
}


module.exports.up = up;
module.exports.down = down;

