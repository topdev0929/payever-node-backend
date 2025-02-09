import { businessesFixture } from '../fixtures/businesses.fixture';
import { dashboardsFixture } from '../fixtures/dashboards.fixture';
import widgetsFixture from '../fixtures/widgets.fixture';

const businessesCollection = 'businesses';
const dashboardsCollection = 'dashboards';
const widgetsCollection = 'widgets';

async function up(db) {
  const businesses = [];
  const dashboards = [];
  const widgets = [];

  for (const fixture of businessesFixture) {
    businesses.push(fixture);
  }

  for (const fixture of dashboardsFixture) {
    dashboards.push(fixture);
  }

  for (const fixture of widgetsFixture) {
    widgets.push(fixture);
  }

  await db.insert(businessesCollection, businesses);
  await db.insert(dashboardsCollection, dashboards);
  await db.insert(widgetsCollection, widgets);

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
