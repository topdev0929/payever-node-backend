import { Connection, createConnection } from 'mongoose';
import { v4 as uuid } from 'uuid';

// tslint:disable
const WidgetTypes: string[] = [
  "transactions", "apps", "products", "checkout", "contacts", "connect", "coupons", 
  "studio", "shipping", "tutorial", "settings", "shop", "site", "pos", "message",
];
const businesscollection: string = 'businesses';
const widgetsCollection: string = 'widgets';
const widgetInstallationsCollection: string = 'widgetinstallations';

type CheckInstallationExistType = (connection: Connection, business: any, widgetId: string) => Promise<boolean>
const checkInstallationExist: CheckInstallationExistType =
  async (connection: Connection, business: any, widgetId: string): Promise<boolean> => {
    const count: number = await connection.collection(widgetInstallationsCollection).countDocuments({
      _id: { $in: business.installations },
      widget: widgetId,
    })

    return count !== 0;
  }

type InstallWidgetForBusinessType = (connection: Connection, business: any, widgetId: string) => Promise<void>
const installWidgetForBusiness: InstallWidgetForBusinessType =
  async (connection: Connection, business: any, widgetId: string): Promise<void> => {
    const installationId: string = uuid()
    await Promise.all([
      connection.collection(widgetInstallationsCollection).insertOne({
        _id: installationId,
        installed: true,
        order: null,
        widget: widgetId,
      }),
      connection.collection(businesscollection).updateOne(
        { _id: business._id },
        { $set: { installations: [...business.installations, installationId] } },
      ),
    ]);
  }

type CheckWidgetInstallationType = (widgetType: string, connection: Connection, db: any) => Promise<void>
const checkWidgetInstallation: CheckWidgetInstallationType =
  async (widgetType: string, connection: Connection, db: any): Promise<void> => {
    const widget: any = (await db._find(widgetsCollection, { type: widgetType }))[0];

    const businesses: any = await db._find(businesscollection, {});

    for (const business of businesses) {
      const installationExist: boolean = await checkInstallationExist(connection, business, widget._id);
      if (!installationExist) {
        await installWidgetForBusiness(connection, business, widget._id);
      }
    }

  }

async function up(db: any): Promise<any> {
  const connection: Connection = createConnection(db.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    for (const widgetType of WidgetTypes) {
      await checkWidgetInstallation(widgetType, connection, db)
    }
  } finally {
    await connection.close();
  }

  return null;
}

function down(): any {
  return null;
}

module.exports.up = up;
module.exports.down = down;
