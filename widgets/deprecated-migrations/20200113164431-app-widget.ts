const widgetsCollection: string = 'widgets';

// tslint:disable
const appWidget: any = {
  _id: "9254aea5-d360-4f00-9430-81477e8e3ed5",
  default: true,
  helpUrl: "https://getpayever.com/apps/",
  icon: "icon-commerceos-pos-64.png",
  order: 89,
  title: "Apps",
  tutorial: {
    icon: "#icon-apps-payments",
    title: "payever Apps",
    url: "https://getpayever.com/help/checkout/",
  },
  type: "apps",
}

async function up(db: any): Promise<void> {
  const existing: Array<{}> = await db._find(widgetsCollection, { type: appWidget.type })
  if (!existing.length) {
    await db.insert(widgetsCollection, appWidget);
  }
}

async function down(db: any): Promise<any> {
  return null;
}

module.exports.up = up;
module.exports.down = down;

