import { Injectable, Logger } from '@nestjs/common';
import { IntercomService } from '@pe/nest-kit';
import { environment } from '../environments';

@Injectable()
export class PhoneNumberService {
  constructor(
    private readonly intercom: IntercomService,
    private readonly logger: Logger,
  ) { }

  public async setupPhoneNumber(phoneNumber: string, businessId: string): Promise<void> {
    const phone: string = '+' + String(Number(phoneNumber));
    const twilioUrl: string =
      environment.thirdPartyCommunicationsUrl
      + `/api/business/${businessId}/integration/twilio/action/inbound-setup`;

    this.logger.log(`Terminal configuration url called: ${twilioUrl}, phone: ${phone}`);
    await (
      await this.intercom.post(twilioUrl, { phone: phone })
    ).toPromise();
  }
}
