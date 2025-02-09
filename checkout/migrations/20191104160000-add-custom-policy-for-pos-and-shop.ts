const channelSetCollection: string = 'channelsets';

export async function up(db: any): Promise<void> {
  await db._run(
    'update',
    channelSetCollection,
    {
      query: {
        $or: [
          {
            type: 'pos',
          },
          {
            type: 'shop',
          },
        ],
      },
      update: { $set: { customPolicy : true }},

      options: {},
    },
  );

  return null;
}

export function down(): void {
  return null;
}
