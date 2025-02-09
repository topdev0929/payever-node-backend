const CollectionName: string = 'integrations';

async function up(db) {
  db._run(
    'remove',
    CollectionName,
    { name: 'twilio' },
  );

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
