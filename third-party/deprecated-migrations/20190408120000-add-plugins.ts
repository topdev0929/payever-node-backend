import { thirdPartiesFixture } from '../fixtures/third-parties.fixture';

const thirdpartiesCollection = 'thirdparties';

async function up(db) {
    for (const fixture of thirdPartiesFixture) {
        const existing: Array<{}> = await db._find(thirdpartiesCollection, { name: fixture.name });
        if (existing.length) {
            continue;
        }

        await db.insert('thirdparties', fixture);
    }

    return null;
}

function down() {
    return null;
}

module.exports.up = up;
module.exports.down = down;
