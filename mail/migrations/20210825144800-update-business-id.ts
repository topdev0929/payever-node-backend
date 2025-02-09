/* tslint:disable:object-literal-sort-keys */
async function up(db: any) : Promise<void> {
  await db._run('update', 'mails', {
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
      multi: true,
      upsert: false,
    },
  });

  return null;
}

function down(): void {
  return null;
}

module.exports.up = up;
module.exports.down = down;
