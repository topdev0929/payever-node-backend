import { Connection, createConnection } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { widgetsFixture } from '../fixtures/widgets.fixture';

// tslint:disable
const WidgetTypes: string[] = ['sites'];
const businesscollection: string = 'businesses';
const widgetsCollection: string = 'widgets';
const widgetInstallationsCollection: string = 'widgetinstallations';

async function up(db: any): Promise<any> {
  const connection: Connection = createConnection(db.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    for (const widgetType of WidgetTypes) {

      const widgetFixture: any = widgetsFixture.find((widget: any) => widget.type === widgetType);
      await db._run(
        'update',
        'widgets',
        {
          query: { _id: widgetFixture._id },
          update: {
            $set: { ...widgetFixture },
          },
          options: { upsert: true },
        },
      );

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

type CheckInstallationExistType = (connection: Connection, business: any, widgetId: string) => Promise<boolean>
const checkInstallationExist: CheckInstallationExistType =
  async (connection: Connection, business: any, widgetId: string): Promise<boolean> => {
    if (!business.installation) {
      return false;
    }

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
    const installations: any = business.installations
      ? [...business.installations, installationId]
      : [ installationId ];
    await Promise.all([
      connection.collection(widgetInstallationsCollection).insertOne({
        _id: installationId,
        installed: true,
        order: null,
        widget: widgetId,
      }),
      connection.collection(businesscollection).updateOne(
        { _id: business._id },
        { $set: { installations } },
      ),
    ]);
  }

type CheckWidgetInstallationType = (widgetType: string, connection: Connection, db: any) => Promise<void>
const checkWidgetInstallation: CheckWidgetInstallationType =
  async (widgetType: string, connection: Connection, db: any): Promise<void> => {
    const widget: any = (await db._find(widgetsCollection, { type: widgetType }))[0];

    if (!widget) {
      return ;
    }

    const businesses: any = await db._find(businesscollection, {});

    for (const business of businesses) {
      const installationExist: boolean = await checkInstallationExist(connection, business, widget._id);
      if (!installationExist) {
        await installWidgetForBusiness(connection, business, widget._id);
      }
    }

  }

module.exports.up = up;
module.exports.down = down;
