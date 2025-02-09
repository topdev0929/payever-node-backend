import { categories } from '../fixtures/categories.fixture';

const categoriesCollection: string = 'categories';

async function up(db: any): Promise<void> {
  for (const category of categories) {
    await db._run('insert', categoriesCollection, category);
  }

  return null;
}

function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
