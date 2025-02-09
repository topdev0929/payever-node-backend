import { EventDispatcher } from '@pe/nest-kit';

import { Model } from 'mongoose';
import * as chai from 'chai';
import * as sinon from 'sinon';

import { UserAccountInterface } from '../../../../src/user/interfaces';
import { UserModel } from '../../../../src/user/models';
import { UserEventsProducer } from '../../../../src/user/producers';
import { UserService } from '../../../../src/user/services/user.service';
import { EmployeeService } from '../../../../src/employees/services/employee.service';

const expect: Chai.ExpectStatic = chai.expect;

describe('user service', () => {
    let service: UserService;
    
    let userModelMock: Model<UserModel>;
    let userModelInstanceMock: UserModel;
    let userEventsProducerMock: UserEventsProducer;
    let eventDispatcherMock: EventDispatcher;
    let employeeServiceMock: EmployeeService;

    let findByIdFnMock: sinon.SinonSpy;
    let createFnMock: sinon.SinonSpy;
    let produceUserCreatedEventFnMock: sinon.SinonSpy;
    let dispatchFnMock: sinon.SinonSpy;
    let findOneByMock: sinon.SinonSpy;
    let updateEmployeeMock: sinon.SinonSpy;
    let createUserAccountDtoMock: UserAccountInterface;
    beforeEach(() => {
        userModelMock = ({}) as any;
        userEventsProducerMock = ({}) as any;
        eventDispatcherMock = ({}) as any;
        employeeServiceMock = ({}) as any;
        service = new UserService(
            userModelMock,
            userEventsProducerMock,
            eventDispatcherMock,
            employeeServiceMock,
        );

        userModelInstanceMock = {} as UserModel;

        findByIdFnMock = sinon.spy(() => userModelInstanceMock);
        userModelMock.findById = findByIdFnMock;

        createFnMock = sinon.spy(() => userModelInstanceMock);
        userModelMock.create = createFnMock;

        produceUserCreatedEventFnMock = sinon.spy(() => undefined);
        userEventsProducerMock.produceUserCreatedEvent = produceUserCreatedEventFnMock;

        dispatchFnMock = sinon.spy(() => undefined);
        eventDispatcherMock.dispatch = dispatchFnMock;

        findOneByMock = sinon.spy(() => undefined);
        updateEmployeeMock = sinon.spy(() => undefined);
        employeeServiceMock.updateEmployee = updateEmployeeMock;
        employeeServiceMock.findOneBy = findOneByMock;

        createUserAccountDtoMock = {} as UserAccountInterface;
    });
    describe('create user account', () => {
        describe('success', async () => {
            it('should not invoke usermodel creation if user already exists', async () => {
                const result: UserModel = await service.createUserAccount(
                    'userId',
                    createUserAccountDtoMock,
                );
                expect(createFnMock.called).to.false;
                expect(produceUserCreatedEventFnMock.called).to.false;
                expect(dispatchFnMock.called).to.false;
                expect(result).to.equal(userModelInstanceMock);
            });
            it('should invoek usermodel creation if user not exists', async () => {
                userModelMock.findById = sinon.spy(() => false) as sinon.SinonSpy;
                const result: UserModel = await service.createUserAccount(
                    'userId',
                    createUserAccountDtoMock,
                );
                expect(createFnMock.called).to.true;
                expect(produceUserCreatedEventFnMock.called).to.true;
                expect(dispatchFnMock.called).to.true;
                expect(result).to.equal(userModelInstanceMock);
            });
        });
        describe('failure', async () => {
            const expectFailure: (done: Mocha.Done) => void = (done: Mocha.Done) => {
                service.createUserAccount(
                    'userId',
                    createUserAccountDtoMock,
                ).then(() => done(true)).catch(() => done());
            }
            const defaultThrowFn: () => never = () => { throw new Error() };

            it('should fail if find by id failed', (done: Mocha.Done) => {
                userModelMock.findById = defaultThrowFn;
                expectFailure(done);
            });
            describe('existing user not found', () => {
                beforeEach(() => {
                    userModelMock.findById = sinon.spy(() => false) as sinon.SinonSpy;
                });
                it('should fail if create failed', (done: Mocha.Done) => {
                    userModelMock.create = defaultThrowFn;
                    expectFailure(done);
                });
                it('should fail if produce user create event failure', (done: Mocha.Done) => {
                    userEventsProducerMock.produceUserCreatedEvent = defaultThrowFn;
                    expectFailure(done);
                });
                it('should fail if event dispatcher fails', (done: Mocha.Done) => {
                    eventDispatcherMock.dispatch = defaultThrowFn;
                    expectFailure(done);
                });
            });
        });
    });
});
