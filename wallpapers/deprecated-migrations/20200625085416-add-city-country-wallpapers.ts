import { countryCityWallpapers } from '../fixtures/city-country-wallpapers.fixture';

const countryCityCollection: string = 'countrycitywallpapers';

async function up(db:any): Promise<void>  {
  for (const entity of countryCityWallpapers) {
    await db._run('insert', countryCityCollection, entity);
  }

  return null;
}

function down(): Promise<void>  {
  return null;
}

module.exports.up = up;
module.exports.down = down;
