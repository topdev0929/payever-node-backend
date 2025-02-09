import { BaseFixture } from '@pe/cucumber-sdk/module';

class SchedulesFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('businesses').insertOne({
      _id: 'business1',
      name: 'Business one',
    });
    await this.connection.collection('businesses').insertOne({
      _id: 'business2',
      name: 'Business two',
    });
    await this.connection.collection('schedules').insertOne({
      _id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      email: 'nadernmds@pep.com',
      duration: 30000,
      paymentMethod: 'paypal',
      businessId: 'business1',
      enabled: true,
    });
    await this.connection.collection('schedules').insertOne({
      _id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      email: 'nadernmds@pep.com',
      duration: 30000,
      paymentMethod: 'paypal',
      businessId: 'business1',
      enabled: true,
    });
  }
}
// @ts-ignore
export = SchedulesFixture;
