import { IntegrationsFixture } from '../fixtures/integrations.fixture';

async function up(db: any): Promise<any> {
  const posts: any[] = await db._find('posts', {
    status: { $ne: 'draft' },
    $or: [
      { toBePostedAt: null },
      { toBePostedAt: { $exists: false } },
      { postedAt: null },
      { postedAt: { $exists: false } }
    ]
  });

  for (const post of posts) {
    const postedAt = post.postedAt || post.createdAt || new Date();
    const toBePostedAt = post.toBePostedAt || postedAt;
    await db._run(
      'update',
      'posts',
      {
        query: { _id: post._id },
        update: { $set: { postedAt, toBePostedAt } },
      });
  }

  return null;
}

async function down(): Promise<any> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
