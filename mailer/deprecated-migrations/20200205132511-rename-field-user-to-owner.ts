async function up(db: any): Promise<void> {
  const businesses: any[] = await db._find('businesses', { user: { $exists: true } });

  let i: number = 0;
  for (const business of businesses) {
    i++;
    if (!business._id || (!business.owner && !business.user)) {
      
      return;
    }

    await db._run(
      'update',
      'businesses',
      {
        query: { _id: business._id },
        update: { $set: { owner: business.user || business.owner }, $unset: { user: '' }},
      });
  }
}

async function down(): Promise<void> {
}

module.exports.up = up;
module.exports.down = down;
