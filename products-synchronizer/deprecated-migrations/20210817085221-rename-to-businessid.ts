export async function up(db: any): Promise<void> {
  try {
    await db.removeIndex('synchronizations', 'business_1_integration_1');
  } catch (e) {}

  await db._run('update', 'synchronizations', {
    query: { },
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

  try {
    await db.removeIndex('synchronizationtasks', 'business_1_integration_1_direction_1');
  } catch (e) {}

  await db._run('update', 'synchronizationtasks', {
    query: { },
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
