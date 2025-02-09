import { connect, model, Model, connection } from 'mongoose';
import { expect } from 'chai';
import { IntegrationSubscriptionService } from './integration-subscription.service';
import { IntegrationSchema, IntegrationSubscriptionSchema } from '../schemas';
import { IntegrationModel, IntegrationSubscriptionModel } from '../models';
import { SinonMock, mock } from 'sinon';
import { BusinessModelLocal, BusinessSchema } from '../../business';
import { environment } from '../../environments';

before(async () => {
  await connect(
    environment.mongodb,
    { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false },
  );
});

after(async () => {
  await connection.close();
});

// tslint:disable-next-line: no-big-function
describe('IntegrationSubscriptionService', () => {
  let ss: IntegrationSubscriptionService;
  let integrationModel: Model<IntegrationModel>;
  let integrationModelMock: SinonMock;
  let subscriptionModel: Model<IntegrationSubscriptionModel>;
  let subscriptionModelMock: SinonMock;
  let businessModel: Model<BusinessModelLocal>;
  let businessModelMock: SinonMock;
  let eventProducerMock: SinonMock;

  beforeEach(async () => {
    await connection.dropDatabase();
  });

  beforeEach(() => {
    integrationModel = model<IntegrationModel>(
      'Integration',
      IntegrationSchema,
    );
    integrationModelMock = mock(integrationModel);

    subscriptionModel = model<IntegrationSubscriptionModel>(
      'IntegrationSubscription',
      IntegrationSubscriptionSchema,
    );
    subscriptionModelMock = mock(subscriptionModel);

    businessModel = model<BusinessModelLocal>('Business', BusinessSchema);
    businessModelMock = mock(businessModel);

    const rc: any = {
      sendThirdPartyEnabledDisabledMessage(): any {},
    };
    eventProducerMock = mock(rc);

    const categoryService: any = {
      findAll(): any {},
    };
    eventProducerMock = mock(categoryService);

    ss = new IntegrationSubscriptionService(
      integrationModel,
      subscriptionModel,
      businessModel,
      rc,
      categoryService,
    );
  });

  it('install', async () => {
    const im = await integrationModel.create({
      _id: '8f1172a7-79fa-417c-a895-dbef8054656e',
      name: 'integration1',
      category: 'category1',
      displayOptions: { title: 'title1', icon: 'icon1' },
      installationOptions: {
        optionIcon: 'optionIcon1',
        price: 'price1',
        links: [
          { type: 'type1', url: 'http://url1.com' },
          { type: 'type2', url: 'http://url2.com' },
        ],
        countryList: ['co1', 'co2'],
        category: 'category1',
        developer: 'developer1',
        languages: 'languages1',
        description: 'description1',
        appSupport: 'appSupport1',
        website: 'website1',
        pricingLink: 'pricingLink1',
      },
    } as any);

    const sm = await subscriptionModel.create({
      _id: 'bb6ac62f-3f2c-48ae-8b9d-8332ce102af9',
      integration: im,
      installed: false,
      payload: null,
    });

    const bm: BusinessModelLocal = await businessModel.create({
      _id: 'd0481e9f-5e0a-45c9-b0b2-6d3a78c8ccd1',
      subscriptions: [sm],
      country: 'country1',
    } as any);

    eventProducerMock.expects('sendThirdPartyEnabledDisabledMessage').withArgs(bm, im, 'connect.event.third-party.enabled');

    const r = await ss.install(im, bm);
    expect(r._id).to.equal(sm._id);
    expect(r.installed).to.equal(true);
    eventProducerMock.verify();
  });

  it('uninstall', async () => {
    const im = await integrationModel.create({
      _id: '4406e2c7-62ce-417b-ac32-90029bb7a685',
      name: 'integration2',
      category: 'category2',
      displayOptions: null,
      installationOptions: null,
    } as any);

    const sm = await subscriptionModel.create({
      _id: '3cc58f89-c957-4796-8e2f-d4be2fef760f',
      integration: im,
      installed: true,
      payload: null,
    });

    const bm: BusinessModelLocal = await businessModel.create({
      _id: 'e9f2d30a-a4d8-4854-9d5f-655e87a84aae',
      subscriptions: [sm],
      country: 'country2',
    } as any);

    eventProducerMock.expects('sendThirdPartyEnabledDisabledMessage').withArgs(bm, im, 'connect.event.third-party.disabled');

    const r = await ss.uninstall(im, bm);
    expect(r._id).to.equal(sm._id);
    expect(r.installed).to.equal(false);
    eventProducerMock.verify();
  });

  it('filterNotInstalledByCountry', async () => {
    const im1 = await integrationModel.create({
      _id: '691f2016-7367-44d9-830e-9d4b0280139a',
      name: 'integration1',
      category: 'category1',
      installationOptions: { countryList: ['n/a', 'country', 'n/a'] },
    } as any);

    const im2 = await integrationModel.create({
      _id: '36ae01cc-1dc8-4560-bd96-1489fc348aef',
      name: 'integration2',
      category: 'category2',
      installationOptions: { countryList: [] },
    } as any);

    const sm1 = await subscriptionModel.create({
      _id: '31245b33-8017-492f-96aa-0c5a8f237779',
      integration: im1,
      installed: true,
    });

    const sm2 = await subscriptionModel.create({
      _id: '3eafc336-6e81-49ce-8fca-bb6762bf7568',
      integration: im1,
      installed: false,
    });

    const sm3 = await subscriptionModel.create({
      _id: 'c63b781a-3e02-48e7-8f76-1a7aa6814cf5',
      integration: im2,
      installed: true,
    });

    const sm4 = await subscriptionModel.create({
      _id: '5d7f8264-74ec-434e-97c0-0cf774c42220',
      integration: im2,
      installed: false,
    });

    const bm = await businessModel.create({
      _id: 'fc5af133-ef52-4fe1-bd88-2f9d1b17fdd8',
      subscriptions: [sm1, sm2, sm3, sm4],
      country: 'country',
    } as any);

    const r = await ss.filterNotInstalledByCountry(bm);
    expect(r.length).to.equal(2);
    expect(r[0]._id).to.equal(sm2._id);
    expect(r[1]._id).to.equal(sm4._id);
  });

  it('findNotInstalled', async () => {
    const im1 = await integrationModel.create({
      _id: 'd437b342-6cbd-42ae-8adb-d6bdc459330d',
      name: 'integration1',
      category: 'category',
    } as any);

    const im2 = await integrationModel.create({
      _id: '018bcbc8-522c-4dcb-8881-4edbd8d7383e',
      name: 'integration2',
      category: 'category',
    } as any);

    const sm1 = await subscriptionModel.create({
      _id: 'dc2462d6-ce37-4bb3-aec0-1096db50b126',
      integration: im1,
      installed: true,
    });

    const sm2 = await subscriptionModel.create({
      _id: '2d824bc6-1f13-4597-83c2-e31eaf33db27',
      integration: im1,
      installed: false,
    });

    const sm3 = await subscriptionModel.create({
      _id: '8a40e17c-b7ef-4ca5-a666-b7a66f9f83e7',
      integration: im2,
      installed: true,
    });

    const sm4 = await subscriptionModel.create({
      _id: 'ac685f7c-435f-4484-b8a8-54062c399b0c',
      integration: im2,
      installed: false,
    });

    const bm = await businessModel.create({
      _id: 'fc5af133-ef52-4fe1-bd88-2f9d1b17fdd8',
      subscriptions: [sm1, sm2, sm3, sm4],
      country: 'country',
    } as any);

    const r = await ss.findNotInstalled(bm);
    expect(r.length).to.equal(2);
    expect(r[0]._id).to.equal(sm2._id);
    expect(r[1]._id).to.equal(sm4._id);
  });

  it('findOneByIntegrationAndBusiness', async () => {
    const im1 = await integrationModel.create({
      _id: 'ca73b176-f856-4110-99d2-4703c582220e',
      name: 'integration1',
      category: 'category',
    } as any);

    const im2 = await integrationModel.create({
      _id: 'c296f6a4-2b56-496b-a3d4-83c46b6a6fdd',
      name: 'integration2',
      category: 'category',
    } as any);

    const sm1 = await subscriptionModel.create({
      _id: '9ffd1123-b385-425f-8ac1-c3b705a50a12',
      integration: im1,
      installed: true,
    });

    const sm2 = await subscriptionModel.create({
      _id: 'afabb57b-b4e0-4092-b937-e4b8df6f7192',
      integration: im1,
      installed: false,
    });

    const sm3 = await subscriptionModel.create({
      _id: 'b88e32b6-d3d5-4f2c-8250-a0fce6fbe1e6',
      integration: im2,
      installed: true,
    });

    const sm4 = await subscriptionModel.create({
      _id: 'eee7285f-a0a4-4316-b0b4-fa7791aad3f7',
      integration: im2,
      installed: false,
    });

    const bm = await businessModel.create({
      _id: '0d7cf4a7-e981-4ffd-ab5c-93bb89755cc8',
      subscriptions: [sm1, sm2, sm3, sm4],
      country: 'country',
    } as any);

    const r = await ss.findOneByIntegrationAndBusiness(im2, bm);
    expect(r._id).to.equal(sm3._id);
  });

  it('findByCategory', async () => {
    const im1 = await integrationModel.create({
      _id: 'c41d31a3-8bf8-485c-8cbf-56bfd8f987b3',
      name: 'integration1',
      category: 'category1',
    } as any);

    const im2 = await integrationModel.create({
      _id: '1363efaa-c925-47f1-a9f4-b6d7e2e4c0d7',
      name: 'integration2',
      category: 'category2',
    } as any);

    const im3 = await integrationModel.create({
      _id: '8800b63a-2444-49e0-ac66-b184233c851e',
      name: 'integration3',
      category: 'category1',
    } as any);

    const im4 = await integrationModel.create({
      _id: 'cd7767e5-7395-4985-8a17-9a3bde71ae73',
      name: 'integration4',
      category: 'category2',
    } as any);

    const sm1 = await subscriptionModel.create({
      _id: 'e7a4f05f-af12-4f95-9c29-2dfb715a3afd',
      integration: im1,
      installed: true,
    });

    const sm2 = await subscriptionModel.create({
      _id: '688bf2b4-6e5b-4866-8a42-6f63da4fbf9f',
      integration: im2,
      installed: true,
    });

    const sm3 = await subscriptionModel.create({
      _id: '5618c3d8-e055-4d0e-8830-7577216ac5f4',
      integration: im3,
      installed: true,
    });

    const sm4 = await subscriptionModel.create({
      _id: 'ea7cd16e-49eb-4769-a86e-a56ad8dc7383',
      integration: im4,
      installed: true,
    });

    const bm = await businessModel.create({
      _id: '5918c12d-fa21-40c3-be20-c07e3ea1c898',
      subscriptions: [sm1, sm2, sm3, sm4],
      country: 'country',
    } as any);

    const r = await ss.findByCategory(bm, 'category2');
    expect(r.length).to.equal(2);
    expect(r[0]._id).to.equal(sm2._id);
    expect(r[1]._id).to.equal(sm4._id);
  });

  it('findByBusiness', async () => {
    const im1 = await integrationModel.create({
      _id: 'a52321f8-808a-4ddc-ac53-82e53d44d64b',
      name: 'integration1',
      category: 'category',
    } as any);

    const im2 = await integrationModel.create({
      _id: '925e0410-aa0c-4dda-aa58-21ca8d6ac395',
      name: 'integration2',
      category: 'category',
    } as any);

    const im3 = await integrationModel.create({
      _id: '1dddacad-953f-45a3-8b0e-44868d236fe4',
      name: 'integration3',
      category: 'category',
    } as any);

    const im4 = await integrationModel.create({
      _id: 'c5513a0e-6ba5-4f3b-936c-c4ebfb4e738a',
      name: 'integration4',
      category: 'category',
    } as any);

    const sm1 = await subscriptionModel.create({
      _id: '183356af-8e5a-4c3e-b004-9e3a044a0c67',
      integration: im1,
      installed: true,
    });

    const sm2 = await subscriptionModel.create({
      _id: '9ecc4455-e802-4601-af0f-95beed520294',
      integration: im2,
      installed: true,
    });

    const sm3 = await subscriptionModel.create({
      _id: '99133835-4c3a-4a4a-ab2e-a4fb4aa4faa0',
      integration: im3,
      installed: true,
    });

    const sm4 = await subscriptionModel.create({
      _id: '5448d85b-d553-4d23-8934-9c481685469f',
      integration: im4,
      installed: true,
    });

    const bm = await businessModel.create({
      _id: 'e33f6f7b-4bcf-48d2-8fd2-68a2fb0bb8c0',
      subscriptions: [sm1, sm2, sm3, sm4],
      country: 'country',
    } as any);

    const r = await ss.findByBusiness(bm);
    expect(r.length).to.equal(4);
    expect(r[0]._id).to.equal(sm1._id);
    expect(r[1]._id).to.equal(sm2._id);
    expect(r[2]._id).to.equal(sm3._id);
    expect(r[3]._id).to.equal(sm4._id);
  });
});
