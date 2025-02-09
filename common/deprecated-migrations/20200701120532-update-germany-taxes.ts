const COLLECTION_NAME: string = 'taxes';

export async function up(db: any): Promise<void> {

  db._run(
    'update',
    COLLECTION_NAME,
    {
      query: {
        country: 'DE',
        rate: 19,
      },
      update: {
        $set: {
          rate: 16,
        },
      },
    },
  );

  return null;
}

export function down(): Promise<void> {
  return null;
}
