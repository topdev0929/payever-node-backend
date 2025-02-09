import { shippingboxesFixture } from '../fixtures/shippingboxes.fixture';

const shippingBoxesCollection = 'shippingboxes';

async function up(db) {
  for (const fixture of shippingboxesFixture) {
    const existing: Array<{}> = await db._find(shippingBoxesCollection, { _id: fixture._id });

    if (!existing.length) {
      await db.insert(shippingBoxesCollection, fixture);
    }
  }

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
