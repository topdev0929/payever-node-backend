module.exports.up = async (db) => {
  await db._run(
    'updateMany',
    'chats',
    {
      query: {
        subType: 'visitor',
      },
      update: {
        $set: {
          subType: 'integration',
        },
      },
    },
  );
}

module.exports.down = async () => {
  return null;
}
