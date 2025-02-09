import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as sinonChai from 'sinon-chai';
import * as sinon from 'sinon';
import { FieldsResolver } from '../../../../../src/appointments/graphql/resolvers';
import { FieldService } from '../../../../../src/appointments/services';
import { FieldModelService } from '../../../../../src/appointments/models-services';
import { Field } from '../../../../../src/appointments/schemas';
import { RedisClient } from '@pe/nest-kit';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('FieldsResolver', () => {
  let sandbox: sinon.SinonSandbox;
  let fieldsResolver: FieldsResolver;
  let fieldService: FieldService;
  let fieldModelService: FieldModelService;
  let field: Field;
  let redisClient: RedisClient;
  let appointmentId: string;

  before(() => {
    field = {
      name: 'Field',
      type: 'text',
      title: 'Name',
    };
    appointmentId = 'appointmentId';

    fieldModelService = {
      find: (): any => { },
      create: (): any => { },
      updateOneByFilter: (): any => { },
    } as any;
    redisClient = {
      set: (): any => { },
    } as any;

    fieldService = new FieldService(fieldModelService, redisClient);
    fieldsResolver = new FieldsResolver(fieldService, fieldModelService);
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = undefined;
  });

  describe('fields', () => {
    it('should find fields with appointmentId', async () => {
      // @ts-ignore
      sandbox.stub(fieldModelService, 'find').resolves([field]);

      expect(
        await fieldsResolver.fields('businessId', 'appointmentId')
      ).to.deep.equal([field]);
    });
  });

  describe('createField', () => {
    it('should create fields with appointmentId', async () => {
      // @ts-ignore
      sandbox.stub(fieldModelService, 'create').resolves(field);

      expect(
        // @ts-ignore
        await fieldsResolver.createField('businessId', field, 'appointmentId'),
      ).to.deep.equal(field);
    });
  });

  describe('createField', () => {
    it('should update fields with appointmentId', async () => {
      // @ts-ignore
      sandbox.stub(fieldModelService, 'updateOneByFilter').resolves(field);

      expect(
        // @ts-ignore
        await fieldsResolver.updateField('id', 'businessId', { ...field, appointmentId} ),
      ).to.deep.equal(field);
    });
  });
});
