export async function up(db: any): Promise<void> {
  try {
    await db.removeIndex('businesswallpapers', 'business_1');
  } catch (e) {}

  await db._run('update', 'businesswallpapers', {
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
