import { apiCallsFixture } from '../fixtures/api-calls-fixture';

const apiCallsCollection: string = 'apicalls';

export async function up(db: any): Promise<null> {
  for (const fixture of apiCallsFixture) {
    const existing: Array<{}> = await db._find(apiCallsCollection, { apiCallId : fixture._id });

    if (!existing.length) {
      await db.insert(apiCallsCollection, fixture);
    }
  }

  return null;
}

export function down(): null {
  return null;
}
