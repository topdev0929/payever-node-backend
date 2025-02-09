import {continents as continentsList} from 'countries-list';
const COLLECTION_NAME: string = 'continents';

export async function up(db: any): Promise<void> {
  for (const continentCode of Object.keys(continentsList)) {
    db._run(
      'update',
      COLLECTION_NAME,
      {
        options: { upsert: true },
        query: {
          _id: continentCode,
        },
        update: {
          $set: {
            _id: continentCode,
            name: continentsList[continentCode],
          },
        },
      },
    );
  }

  return null;
}

export function down(): Promise<void> {
  return null;
}
