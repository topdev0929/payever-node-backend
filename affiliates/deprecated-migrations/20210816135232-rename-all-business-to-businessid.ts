// tslint:disable: object-literal-sort-keys
export async function up(db: any): Promise<void> {
  try {
    await db.removeIndex('businessaffiliates', 'affiliate_1_business_-1');
    await db.removeIndex('businessaffiliates', 'program_1_business_-1');
  } catch (e) { }

  await db._run('update', 'businessaffiliates', {
    query: { },
    update: {
      $rename: {
        business: 'businessId',
      },
    },
    options: {
      multi: true,
      upsert: false,
    },
  });
}

export async function down(): Promise<void> { }

module.exports.up = up;
module.exports.down = down;
