export async function up(db: any): Promise<void> {
  try {
    await db.removeIndex('terminals', 'business_1_name_1');
    await db.removeIndex('terminals', 'business_1_active_1');
  } catch (e) {}

  await db._run('update', 'terminals', {
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
