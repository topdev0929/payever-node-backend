import { Injectable } from '@nestjs/common';
import { CampaignMailDto, MailDto } from '../dto';
import { SenderService } from './sender.service';
import { SingleMailTransformer, CampaignMailTransformer } from '../transformers';

@Injectable()
export class CampaignMailService {
  constructor(
    private readonly singleMailTransformer: SingleMailTransformer,
    private readonly sendService: SenderService,
  ) {
  }

  public async send(builderMailDto: CampaignMailDto): Promise<any[]> {
    const mailDtos: MailDto[] = CampaignMailTransformer.transform(builderMailDto);

    const promise: any[] = [];

    for (const mailDto of mailDtos) {
      promise.push(this.sendService.send(mailDto));
    }

    return promise;
  }
}
