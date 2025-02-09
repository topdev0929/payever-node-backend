import { thirdPartiesFixture } from '../fixtures/third-parties.fixture';

const thirdpartiesCollection = 'thirdparties';

async function up(db) {
    for (const fixture of thirdPartiesFixture) {
        if (fixture.category === 'shippings') {
            await db._run(
                'update',
                thirdpartiesCollection,
                {
                    query: { _id: fixture._id },
                    update: fixture,
                    options: {},
                },
            );
        }
    }

    return null;
}

function down() {
    return null;
}

module.exports.up = up;
module.exports.down = down;
