import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { SignupModel, SignupsService } from '../signups';
import { BaseCrmClientService } from '../base-crm/services';
import { FollowupEmailEventProducer } from './followup-email-event.producer';
import { BaseCrmContactInterface } from '../base-crm/interfaces';

@Injectable()
export class FollowupService {
  constructor(
    private readonly followupEmailEventProducer: FollowupEmailEventProducer,
    private readonly signupsService: SignupsService,
    private readonly baseCrmClientService: BaseCrmClientService,
    private readonly logger: Logger,
  ) { }

  public async onFirstSignup(signup: SignupModel): Promise<void> {
    await this.followupEmailEventProducer.sendSignupEmail(`signup.${signup.app}`, signup);
    this.logger.log(`Send first signup email to ${signup.email}`);
  }

  public async processSignupsForInterval(intervalHours: number): Promise<SignupModel[]> {
    this.logger.log(`Processing followups for interval ${intervalHours}`);

    const signups: SignupModel[] = await this.signupsService.getSignupsByCriteria({
      baseCrmContactId: { $ne: null },
      contacted: false,
      createdAt: {
        $gte: moment().subtract(intervalHours, 'hours').toDate(),
        $lte: moment().subtract(intervalHours - 1, 'hours').toDate(),
      },
      followupsSent: { $ne: intervalHours },
    });

    for (const signup of signups) {
      try {
        await this.processFollowupForSignup(signup, intervalHours);
      } catch (e) {
        this.logger.error(`Failed processing followup for ${signup.email}: ${JSON.stringify(e.message)}`);
      }
    }

    return signups;
  }

  private async processFollowupForSignup(signup: SignupModel, interval: number): Promise<void> {
    this.logger.log(`Processing followup for signup ${signup.email}, contactId ${signup.baseCrmContactId}...`);
    const contact: BaseCrmContactInterface = await this.baseCrmClientService.findContactById(signup.baseCrmContactId);

    if (contact.custom_fields.Pilot === 'Yes') {
      await this.signupsService.markSignupAsContacted(signup);
      this.logger.log(
        `Skipping followup for contact ${contact.email}, contactId ${signup.baseCrmContactId}: Pilot=Yes`,
      );

      return;
    }

    await this.sendFollowupIntervalEmail(signup, interval);
    await this.signupsService.registerFollowupSent(signup, interval);
    this.logger.log(`Sent followup email ${interval} to ${signup.email}, contactId ${signup.baseCrmContactId}`);
  }

  private sendFollowupIntervalEmail(signup: SignupModel, interval: number): Promise<void> {
    return this.followupEmailEventProducer.sendSignupEmail(
      `signup.${signup.app}.followup.hour_${interval}`,
      signup,
    );
  }
}
