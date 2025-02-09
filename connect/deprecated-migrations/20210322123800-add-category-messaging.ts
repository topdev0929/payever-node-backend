import { categories } from '../fixtures/categories.fixture';

const categoriesCollection: string = 'categories';
const integrationName: string = 'messaging';

async function up(db: any): Promise<void> {
  const category: any = categories.find((cat: any) => cat.name === integrationName);

  await db._run('insert', categoriesCollection, category);

  return null;
}

function down(): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
