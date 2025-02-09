import { channelsFixture } from '../fixtures/channels.fixture';

const channelsCollection = 'channels';

export async function up(db: any): Promise<void> {
  for (const fixture of channelsFixture) {
    const existing: Array<{}> = await db._find(channelsCollection, { type: fixture.type });

    if (!existing.length) {
      fixture.createdAt = new Date();
      fixture.createdAt = new Date();
      await db.insert(channelsCollection, fixture);
    }
  }

  return null;
}

export async function down(): Promise<void> {
  return null;
}

