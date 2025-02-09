/* tslint:disable:object-literal-sort-keys */
export async function up(db: any): Promise<void> {

  await db._run(
    'update',
    'widgets',
    {
      query: { },
      update: {
        $set: {
          installByDefault: false,
        },
      },
      options: {
        multi: true,
        upsert: false,
      },
    },
  );

  await db._run(
    'update',
    'widgets',
    {
      query: { type : 'apps' },
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
