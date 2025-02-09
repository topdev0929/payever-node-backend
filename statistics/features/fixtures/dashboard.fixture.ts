import { BaseFixture } from "@pe/cucumber-sdk";
import { businessFactory, DashboardFactory } from './factories';

const businessId: string = '568192aa-36ea-48d8-bc0a-8660029e6f72';
const businessIdIsDefault: string = '928bed1f-337c-4a3d-8025-5b0bb8f827f4';
const businessIdSetIsDefault: string = '8c60ed1c-d50b-495b-93a7-74668cc4cbd7';
const dashboardId: string = '2a6171ec-6bbe-4c75-9997-e1bf7d6c08cd';
const prevDefaultDashboardId: string = '9969aa61-2361-4425-b0ef-94a45c7bd2d5';
const newDefaultDashboardId: string = '3aa0a192-362d-4a72-87e9-7525c50f07ca';

class DashboardFixture extends BaseFixture {
  public async apply(): Promise<void> {

    await this.connection.collection('businesses').insertOne(businessFactory({
      _id: businessId,
      owner: 'ooooo-ooo-ooo-oooooo-oo',
      installedApps: [
        {
          code: 'checkout',
        },
      ],
    }));

    await this.connection.collection('businesses').insertOne(businessFactory({
      _id: businessIdIsDefault,
      owner: 'ooooo-ooo-ooo-oooooo-oo',
      installedApps: [
        {
          code: 'checkout',
        },
      ],
    }));

    await this.connection.collection('dashboards').insertOne(DashboardFactory({
      _id: dashboardId,
      businessId: businessId,
      createdBy: 'admin',
    }));

    await this.connection.collection('businesses').insertOne(businessFactory({
      _id: businessIdSetIsDefault,
      owner: 'ooooo-ooo-ooo-oooooo-oo',
      installedApps: [
        {
          code: 'checkout',
        },
      ],
    }));

    await this.connection.collection('dashboards').insertOne(DashboardFactory({
      _id: prevDefaultDashboardId,
      businessId: businessIdSetIsDefault,
      createdBy: 'admin',
      isDefault: true
    }));

    await this.connection.collection('dashboards').insertOne(DashboardFactory({
      _id: newDefaultDashboardId,
      businessId: businessIdSetIsDefault,
      createdBy: 'admin',
      isDefault: false
    }));
  }
}

export = DashboardFixture;
