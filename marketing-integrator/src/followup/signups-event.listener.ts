import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { SignupsEventsEnum, SignupModel } from '../signups';
import { FollowupService } from './followup.service';

@Injectable()
export class SignupsEventListener {
  constructor(
    private readonly followupService: FollowupService,
  ) { }

  @EventListener(SignupsEventsEnum.SignupCreated)
  public async onSignupRecordCreated(signup: SignupModel): Promise<void> {
    await this.followupService.onFirstSignup(signup);
  }
}
