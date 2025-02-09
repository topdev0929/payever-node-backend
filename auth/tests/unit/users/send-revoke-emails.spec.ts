import { Test } from '@nestjs/testing';
import * as chai from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import { SendRevokeEmailsCron } from '../../../src/users/cron/send-revoke-emails.cron';
import { UserService } from '../../../src/users/services/user.service';
import { MailerEventProducer } from '../../../src/users/producer/mailer-messages.producer';
import { Logger } from '@nestjs/common';
import * as moment from 'moment';

const expect = chai.expect;

const userService = {
  getInactiveUsersWithoutReminder: async () => [],
  setRevokeAccountDate: async () => {},
};

const mailerEventProducer = {
  produceRevokeUserEmailMessage: async () => {},
};

const mockLogger = {
  log: () => {},
};

describe('SendRevokeEmailsCron', () => {
  let sandbox;
  let cronJob: SendRevokeEmailsCron;

  before(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SendRevokeEmailsCron,
        { provide: UserService, useValue: userService },
        { provide: MailerEventProducer, useValue: mailerEventProducer },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    cronJob = module.get<SendRevokeEmailsCron>(SendRevokeEmailsCron);
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  it('should call findUsersNotUpdatedSince with date six months ago', async () => {
    const sixMonthsAgo = moment().subtract(6, 'months').toDate();
    const getInactiveUsersWithoutReminderStub = sandbox.stub(userService, 'getInactiveUsersWithoutReminder').resolves([]);

    await cronJob.sendRevokeEmails();

    expect(getInactiveUsersWithoutReminderStub.calledOnce).to.be.true;
    expect(getInactiveUsersWithoutReminderStub.calledWith(sixMonthsAgo)).to.be.true;    
  });

  it('should call produceRevokeUserEmailMessage for each user ', async () => {
    const sixMonthsAgo = moment().subtract(6, 'months').toDate();
    const users = [{ id: '1', revokeAccountDateAt: null }, { id: '2', revokeAccountDateAt: null }];
    sandbox.stub(userService, 'findUsersNotUpdatedSince').resolves(users);
    const produceRevokeUserEmailMessageStub = sandbox.stub(mailerEventProducer, 'produceRevokeUserEmailMessage').resolves();
    const setRevokeAccountDateStub = sandbox.stub(userService, 'setRevokeAccountDate').resolves();

    await cronJob.sendRevokeEmails();

    expect(produceRevokeUserEmailMessageStub.callCount).to.equal(users.length);
    expect(setRevokeAccountDateStub.callCount).to.equal(users.length);

    users.forEach(user => {
      expect(produceRevokeUserEmailMessageStub.calledWith(user, 'en')).to.be.true;
      expect(setRevokeAccountDateStub.calledWith(user.id, sinon.match.date)).to.be.true;
    });
  });
});