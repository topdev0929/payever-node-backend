module.exports.up = async (db) => {
  await db._run(
    'updateMany',
    'chats',
    {
      query: {
        type: { $ne: 'group' },
      },
      update: {
        $set: {
          type: 'chat',
        },
      },
    },
  );
}

module.exports.down = async () => {
  return null;
}
