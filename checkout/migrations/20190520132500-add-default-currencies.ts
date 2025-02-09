import { currencies } from '../fixtures/currencies.fixture';

const currenciesCollection = 'currencies';

async function up(db) {
  for (const currency of currencies) {
      await db._run('insert', currenciesCollection, currency);
  }

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
