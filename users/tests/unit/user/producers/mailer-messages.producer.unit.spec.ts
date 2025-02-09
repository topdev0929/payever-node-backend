import { MessageBusService, MessageInterface, RabbitMqClient } from '@pe/nest-kit';

import * as chai from 'chai';
import * as sinon from 'sinon';

import { TrafficSourceDto } from '../../../../src/user/dto';
import { MailerEnum } from '../../../../src/user/enums/mailer.enum';
import { BusinessModel, UserModel } from '../../../../src/user/models';
import { MailerEventProducer } from '../../../../src/user/producers/mailer-messages.producer';

const expect: Chai.ExpectStatic = chai.expect;

const testEmail: string = 'inbox@example.com';

describe('mailer messages producer', () => {
    let producer: MailerEventProducer;

    let rabbitClientMock: RabbitMqClient;
    let messageBusServiceMock: MessageBusService;

    let createMessageFnSpy: sinon.SinonSpy;
    let sendFnSpy: sinon.SinonSpy;

    let userModelMock: UserModel;
    let businessModelMock: BusinessModel;
    let trafficSourceDtoMock: TrafficSourceDto;
    let messageMock: MessageInterface;
    
    beforeEach(() => {
        rabbitClientMock = ({}) as any;
        messageBusServiceMock = ({}) as any;

        producer = new MailerEventProducer(
            rabbitClientMock,
            messageBusServiceMock,
        );

        createMessageFnSpy = sinon.spy(() => messageMock);
        messageBusServiceMock.createMessage = createMessageFnSpy;

        sendFnSpy = sinon.spy();
        rabbitClientMock.send = sendFnSpy;

        userModelMock = {

        } as UserModel;
        businessModelMock = {

        } as BusinessModel;

        trafficSourceDtoMock = {

        } as TrafficSourceDto;

        messageMock = {

        } as MessageInterface;
    });
    describe('business messages produce', () => {
        describe('success business messages produce', () => {
            beforeEach(async () => {
                await producer.produceBusinessCreatedEmailMessage(
                    userModelMock,
                    businessModelMock,
                    trafficSourceDtoMock,
                    testEmail,
                );
            });
            it('should send message to rabbit', () => {
                expect(sendFnSpy.args[0][0]).to.contain({
                    channel: MailerEnum.SendEmail,
                    exchange: 'async_events',
                });
                expect(sendFnSpy.args[0][1]).to.equal(messageMock);
            });
        });
        describe('failure business messages produce', () => {
            const expectFailure: (done: Mocha.Done) => void = (done: Mocha.Done) => {
                producer.produceBusinessCreatedEmailMessage(
                    userModelMock,
                    businessModelMock,
                    trafficSourceDtoMock,
                    testEmail,
                ).then(() => done(true)).catch(() => done());
            }
            const defaultThrowFn: () => never = () => { throw new Error() };

            it('should fail if rabbit send failed', (done: Mocha.Done) => {
                rabbitClientMock.send = defaultThrowFn;
                expectFailure(done);
            });
        });
    });
});
