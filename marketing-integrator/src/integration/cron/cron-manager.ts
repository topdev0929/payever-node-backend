import { Injectable, Logger } from '@nestjs/common';
import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import * as schedule from 'node-schedule';
import { environment } from '../../environment/environment';
import { BaseCrmContactsCommand, MailchimpContactsCommand } from '../commands';
import { FollowupService } from '../../followup';

@Injectable()
export class CronManager extends Server implements CustomTransportStrategy {
  constructor(
    private readonly baseCrmContactsCommand: BaseCrmContactsCommand,
    private readonly mailchimpContactsCommand: MailchimpContactsCommand,
    private readonly followupService: FollowupService,
    protected readonly logger: Logger,
  ) {
    super();
  }

  public async listen(callback: () => void): Promise<void> {
    schedule.scheduleJob(
      environment.synchronizationCron,
      this.runCommandsChain.bind(this),
    );
    this.logger.log(`Scheduled synchronization job with: ${environment.synchronizationCron}`);

    callback();
  }

  public async close(): Promise<void> {
    return null;
  }

  private async runCommandsChain(): Promise<void> {
    await this.baseCrmContactsCommand.synchronize();
    await this.mailchimpContactsCommand.synchronize();

    await this.sendFollowups();
  }

  private async sendFollowups(): Promise<void> {
    const intervals: number[] = [144, 96, 48];

    for (const interval of intervals) {
      await this.followupService.processSignupsForInterval(interval);
    }
  }
}
