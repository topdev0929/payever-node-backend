import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { Logger } from '@nestjs/common';
import { SynchronizeService } from '../../../../src/inventory/services/synchronize.service';
import { EventProducer } from '../../../../src/inventory/producer/event.producer';
import { InventoryService } from '../../../../src/inventory/services/inventory.service';
import { BusinessModel } from '../../../../src/business/models/business.model';
import { StockChangedDto } from '../../../../src/inventory/dto/rmq/stock-changed.dto';
import { InventoryModel } from '../../../../src/inventory/models/inventory.model';


chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('SynchronizeService', () => {
    let sandbox: sinon.SinonSandbox;
    let testService: SynchronizeService;
    let eventProducer: EventProducer;
    let inventoryService: InventoryService;
    const businessModel: BusinessModel = {
        name: 'test business model'
    } as any;

    before(() => {

        inventoryService = {
            findOneById: (): any => { },
            findOneByBusinessAndSku: (): any => { },
            addStock: (): any => { },
            subtractStock: (): any => { }
        } as any;

        eventProducer = {

        } as any;

        testService = new SynchronizeService(inventoryService, eventProducer);
    });

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
        sandbox = undefined;
    });

    describe('addStock', () => {

        it('should add stock', async () => {
            const stockChangedDto = new StockChangedDto();
            stockChangedDto.sku = '12345';
            stockChangedDto.quantity = 5;

            const inventoryModel: InventoryModel = {
                product: 'testprod',
                sku: '12345',
                barcode: '',
                stock: 5,
                reserved: 0
            } as InventoryModel;


            sandbox.useFakeTimers();
            sandbox.stub(inventoryService, 'findOneById');
            sandbox.stub(inventoryService, 'findOneByBusinessAndSku').resolves(inventoryModel);
            sandbox.stub(inventoryService, 'addStock').resolves(inventoryModel);

            const res = await testService.addStock(businessModel, stockChangedDto);
            expect(res).to.deep.equal(inventoryModel);
        });
    });

    describe('subtractStock', () => {
        it('should subtract stock', async () => {
            const stockChangedDto = new StockChangedDto();
            stockChangedDto.sku = '12345';
            stockChangedDto.quantity = 5;

            const inventoryModel: InventoryModel = {
                product: 'testprod',
                sku: '12345',
                barcode: '',
                stock: 5,
                reserved: 0
            } as InventoryModel;


            sandbox.useFakeTimers();
            sandbox.stub(inventoryService, 'findOneById');
            sandbox.stub(inventoryService, 'findOneByBusinessAndSku').resolves(inventoryModel);
            sandbox.stub(inventoryService, 'subtractStock').resolves(inventoryModel);

            const res = await testService.subtractStock(businessModel, stockChangedDto);
            expect(res).to.deep.equal(inventoryModel);
        });
    });
});
