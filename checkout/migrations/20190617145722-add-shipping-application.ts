const applicationCollection = 'applications';
async function up(db) {
  await db.insert(applicationCollection, {_id: 'a1da7545-602c-4506-9e22-3ff5a393fe8f', name: 'shipping'});

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
