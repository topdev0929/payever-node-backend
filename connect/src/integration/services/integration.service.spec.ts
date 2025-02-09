import { IntegrationService } from './integration.service';
import { IntegrationSchema, IntegrationReviewSchema, IntegrationVersionSchema } from '../schemas';
import { IntegrationModel, IntegrationReviewModel, IntegrationVersionModel } from '../models';
import { model, Model } from 'mongoose';
import { SinonMock, mock } from 'sinon';
import { expect } from 'chai';
import { CreateIntegrationDto } from '../dto/create-integration.dto';
import 'sinon-mongoose';
import { AddIntegrationVersionDto } from '../dto';
import { IntegrationReviewInterface } from '../interfaces';

describe('IntegrationService', () => {
  let im: Model<IntegrationModel>;
  let irm: Model<IntegrationReviewModel>;
  let irvm: Model<IntegrationVersionModel>;
  let is: IntegrationService;
  let imMock: SinonMock;

  beforeEach(() => {
    im = model<IntegrationModel>('Integration', IntegrationSchema);
    irm = model<IntegrationReviewModel>('IntegrationReview', IntegrationReviewSchema);
    irvm = model<IntegrationVersionModel>('IntegrationVersion', IntegrationVersionSchema);
    imMock = mock(im);
    is = new IntegrationService(im);
  });

  afterEach(function () {
    imMock.restore();
  });

  it('findAll', async () => {
    imMock
      .expects('find')
      .withArgs()
      .returns('RESULT');

    const r = await is.findAll();
    expect(r).to.equal('RESULT');
    imMock.verify();
  });

  it('findByCategory', async () => {
    imMock
      .expects('find')
      .withArgs({
         category: 'category1',
         enabled: true,
        },
        {},
        {
          sort: {
            order: 1,
          },
        },
      )
      .returns([
        { _id: 'cbf9b1a4-5ae2-48ec-b0a0-0cec1acba19f', name: 'name1' },
        { _id: '5c403dd5-ee39-407f-bdef-cd3e6d477073', name: 'name3' },
        { _id: '2184e553-0705-42bd-b87b-f2ff771fa80d', name: 'name2' },
      ]);

    const r = await is.findByCategory('category1');
    expect(r).to.deep.equal([
      { _id: 'cbf9b1a4-5ae2-48ec-b0a0-0cec1acba19f', name: 'name1' },
      { _id: '2184e553-0705-42bd-b87b-f2ff771fa80d', name: 'name2' },
      { _id: '5c403dd5-ee39-407f-bdef-cd3e6d477073', name: 'name3' },
    ]);
    imMock.verify();
  });

  it('findOneById', async () => {
    imMock
      .expects('findById')
      .withArgs('0326db56-e9e1-4be3-a140-84303abd17b8')
      .returns('RESULT');

    const r = await is.findOneById('0326db56-e9e1-4be3-a140-84303abd17b8');
    expect(r).to.equal('RESULT');
    imMock.verify();
  });

  it('findOneByName', async () => {
    imMock
      .expects('findOne')
      .withArgs({ name: 'name1' })
      .returns('RESULT');

    const r = await is.findOneByName('name1');
    expect(r).to.equal('RESULT');
    imMock.verify();
  });

  it('findOneByNameWithOptions', async () => {
    imMock
      .expects('findOne')
      .withArgs({ name: 'name1' })
      .returns({ name: 'name1' });

    const r = await is.findOneByName('name1', true);
    const expected = {
      name: 'name1',
      ratingsCount: 0,
      avgRating: 0,
      latestVersion: undefined
    };

    expect(r.name).to.equal(expected.name);
    expect(r.ratingsCount).to.equal(expected.ratingsCount);
    expect(r.avgRating).to.equal(expected.avgRating);

    imMock.verify();
  });

  it('findOneByNameAndCategory', async () => {
    imMock
      .expects('findOne')
      .withArgs({ name: 'name1', category: 'category1' })
      .returns('RESULT');

    const r = await is.findOneByNameAndCategory('name1', 'category1');
    expect(r).to.equal('RESULT');
    imMock.verify();
  });

  it('create', async () => {
    const dto: CreateIntegrationDto = {
      name: 'name1',
      category: 'category1',
    } as any;
    imMock
      .expects('create')
      .withArgs(dto)
      .returns('RESULT');

    const r = await is.create(dto);
    expect(r).to.equal('RESULT');
    imMock.verify();
  });

  it('addReview', async() => {
    const imdto: CreateIntegrationDto = {
      name: 'integration name',
      category: 'integration category',
      reviews: [],
    } as any;

    imMock
      .expects('create')
      .withArgs(imdto)
      .returns(imdto);

    const im1 = await is.create(imdto);
    
    const irmdto: IntegrationReviewInterface = {
      title: 'review title',
      text: 'review text',
      userId: '',
      userFullName: '',
      reviewDate: ''
    };

    imMock
      .expects('updateOne')
      .withArgs({ _id: im1._id }, { $set: { reviews: im1.reviews } })
      .chain('exec')
      .returns({
        name: 'integration name',
        category: 'integration category',
        reviews: [
          {
            title: 'review title',
            text: 'review text'
          },
        ],
      });
    
    const imOut = await is.addReview(im1, irmdto);

    expect(imOut.reviews[0].title).to.equal('review title');
  });

  it('addRating', async() => {

    const imdto: CreateIntegrationDto = {
      name: 'integration name',
      category: 'integration category',
      reviews: [],
    } as any;

    imMock
      .expects('create')
      .withArgs(imdto)
      .returns(imdto);
   
    const im1 = await is.create(imdto);

    const irmdto: IntegrationReviewInterface = {
      title: 'review title',
      text: 'review text',
      userId: '',
      userFullName: '',
      reviewDate: '',
      rating: 5
    };
    
    imMock
      .expects('updateOne')
      .withArgs({ _id: im1._id }, { $set: { reviews: im1.reviews } })
      .chain('exec')
      .returns({
        name: 'integration name',
        category: 'integration category',
        reviews: [
          {
            rating: 5
          },
        ],
      });
    
    const imOut = await is.addRating(im1, irmdto);

    expect(imOut.reviews[0].rating).to.equal(5);
  });

  it('incrementInstallCounter', async() => {
    const imdto: CreateIntegrationDto = {
      name: 'integration name',
      category: 'integration category',
      reviews: [],
    } as any;

    imMock
      .expects('create')
      .withArgs(imdto)
      .returns(imdto);
   
    const im1 = await im.create(imdto);

    imMock
      .expects('updateOne')
      .withArgs({ _id: im1._id }, { $set: { timesInstalled: 1 } })
      .chain('exec')
      .returns({
        name: 'integration name',
        category: 'integration category',
        timesInstalled: 1
      });

    await is.incrementInstallCounter(im1);

    expect(im1.timesInstalled).to.equal(1);
  });

  it('addVersion', async() => {
    const imdto: CreateIntegrationDto = {
      name: 'integration name',
      category: 'integration category',
      versions: [],
    } as any;

    imMock
      .expects('create')
      .withArgs(imdto)
      .returns(imdto);
   
    const im1 = await is.create(imdto);

    const irvmdto: AddIntegrationVersionDto = {
      _id: '',
      description: 'version text',
      version: '0.0.1',
      versionDate: new Date().toISOString(),
    };

    imMock
      .expects('updateOne')
      .withArgs({ _id: im1._id }, { $set: { versions: im1.versions } })
      .chain('exec')
      .returns({
        name: 'integration name',
        category: 'integration category',
        versions: [
          {
            description: 'version text',
            version: '0.0.1',
            versionDate: new Date().toISOString(),
          },
        ],
      });

    await is.addVersion(im1, irvmdto);

    expect(im1.versions[0].version).to.equal('0.0.1');
  });
});
