import { INestApplication, Logger } from '@nestjs/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import { CucumberOptionsInterface, ProviderInterface } from '@pe/cucumber-sdk';
import { ITestStepHookParameter } from '@cucumber/cucumber';
import * as nodemailer from 'nodemailer';

import { MailDto } from '../../src/mailer/dto/nodemailer';
import { NodeMailerWrapperInterface } from '../../src/mailer/interfaces';
import { NodeMailerWrapper } from '../../src/mailer/services/node-mailer.wrapper';
import { MailerStorage } from './mailer.storage';

const MAILER_STUB_NAME: string = 'MAILER_STUB';

export class MailerStub implements ProviderInterface, NodeMailerWrapperInterface {
  public constructor(protected options: CucumberOptionsInterface) { }

  public async configure(
    builder: TestingModuleBuilder,
    scenario: ITestStepHookParameter,
  ): Promise<void> {
    builder.overrideProvider(NodeMailerWrapper).useClass(MailerStub);
  }

  public send(mailDto: MailDto): Promise<nodemailer.SentMessageInfo> {
    MailerStorage.addMail(mailDto);

    return Promise.resolve();
  }

  public async setup(application: INestApplication, logger: Logger): Promise<void> { }

  public async close(): Promise<void> {
    MailerStorage.clear();
  }

  public getName(): string {
    return MAILER_STUB_NAME;
  }
}
