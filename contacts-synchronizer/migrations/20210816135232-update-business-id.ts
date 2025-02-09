export async function up(db: any): Promise<void> {
  await db._run('update', 'synchronizations', {
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
      upsert: false,
      multi: true,
    },
  });

  await db._run('update', 'synchronizationtasks', {
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
      upsert: false,
      multi: true,
    },
  });
}

export async function down(): Promise<void> { }

module.exports.up = up;
module.exports.down = down;
