import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { classToPlain } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Model } from 'mongoose';
import { environment } from '../../environments';
import { MailDto } from '../dto';
import { LoggingContextsEnum } from '../enum';
import { Log } from '../interfaces';
import { LogSchemaName, MailServerConfigSchemaName } from '../schemas';
import { NodeMailerWrapper } from './node-mailer.wrapper';
import { MailServerConfigModel } from '../models';

@Injectable()
export class SenderService {
  private readonly logger: Logger = new Logger(LoggingContextsEnum.mailer);

  constructor(
    @InjectModel(LogSchemaName) private readonly loggingModel: Model<Log>,
    @InjectModel(MailServerConfigSchemaName) private readonly mailServerConfig: Model<MailServerConfigModel>,
    private readonly nodeMailerWrapper: NodeMailerWrapper,
  ) { }

  public async send(mailDto: MailDto): Promise<void> {
    try {
      const validationErrors: ValidationError[] = await validate(mailDto);

      if (validationErrors.length) {
        this.logger.warn({
          mailDto,
          message: 'Validation failed for mail dto',
          validationErrors,
        });
      }

      mailDto.serverConfig = await this.initializeMailServerConfig(mailDto);

      if (environment.explicitDeliveryAddresses) {
        this.replaceDestinationAddresses(mailDto);

        await this.reallySend(mailDto);

        return;
      }

      if (!environment.disableDelivery) {
        await this.reallySend(mailDto);

        return;
      }

      this.logger.log('Email delivery is disabled by a `disableDelivery` setting', JSON.stringify(mailDto));
    } catch (e) {
      this.logger.warn({
        error: e.message,
        mailDto,
        message: 'Mail sending failed',
      });
    }
  }

  private async logSending(mailDto: MailDto): Promise<Log> {
    return this.loggingModel.create(classToPlain(mailDto) as Log);
  }

  private replaceDestinationAddresses(mailDto: MailDto): void {
    mailDto.to = environment.explicitDeliveryAddresses.join(',');
    this.logger.log(`Delivery addresses were explicitly replaced to ${mailDto.to}`, JSON.stringify(mailDto));

    if (environment.disableDelivery) {
      mailDto.cc = [];
      mailDto.bcc = [];
    }
  }

  private async reallySend(mailDto: MailDto): Promise<void> {
    await this.nodeMailerWrapper.send(mailDto);
    await this.logSending(mailDto);
  }

  private async initializeMailServerConfig(mailDto: MailDto): Promise<MailServerConfigModel> {
    const serverConfig: MailServerConfigModel = await this.mailServerConfig.findOne({
      serverType: mailDto.serverType,
    });

    if (!serverConfig) {
      throw new NotFoundException(`mais server config not found for type: ${mailDto.serverType}`);
    }

    return serverConfig;
  }
}
