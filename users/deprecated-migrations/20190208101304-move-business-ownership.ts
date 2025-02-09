async function up(db) {
  console.log('Fetching businesses with "user" field still existing');
  const businesses: any[] = await db._find('businesses', {user: {$exists: true}});

  console.log(`Found ${businesses.length} businesses to migrate`);
  let i = 0;
  for (const business of businesses) {
    i++;
    console.log(`processing entry ${i} of ${businesses.length}, id:${business._id}`);
    if (!business._id || (!business.owner && !business.user)) {
      console.log(`invalid entry, skipping`);

      return;
    }

    console.log(`pushing business to user ${business.user || business.owner} `);
    await db._run(
      'update',
      'users',
      {
        query: { _id: business.user || business.owner },
        update: { $addToSet: {businesses: business._id} },
      });

    console.log(`updating "owner" field in business`);
    await db._run(
      'update',
      'businesses',
      {
        query: { _id: business._id },
        update: { $set: {owner: business.user || business.owner}, $unset: {user: ''}},
      });

  }

  return null;
}

async function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
