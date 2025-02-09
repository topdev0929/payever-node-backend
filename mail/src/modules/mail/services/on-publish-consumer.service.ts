import { Injectable } from '@nestjs/common';
import { MailAccessConfigModel, MailModel } from '../models';
import { CompiledThemeService } from '@pe/builder-theme-kit/module/service';
import { MailAccessConfigService } from './mail-access-config.service';
import { MailService } from './mail.service';
import { environment } from '../../../environments';

@Injectable()

export class OnPublishConsumerService {
  constructor(
    private readonly mailService: MailService,
    private readonly compiledThemeService: CompiledThemeService,
    private readonly mailAccessConfigService: MailAccessConfigService,
  ) {
  }

  public async publishMailData(mailId: string, pageIds: string[], version: string): Promise<any> {
    const mail: MailModel = await this.mailService.findOneById(mailId);
    if (!mail) {
      return ;
    }

    const domainNames: string[] = [];
    const mailAccessConfigModel: MailAccessConfigModel
      = await this.mailAccessConfigService.findByMailOrCreate(mail);
    await this.mailAccessConfigService.setLive(mail);
    const accessDomain: string = `${mailAccessConfigModel.internalDomain}.${environment.mailDomain}`;

    domainNames.push(accessDomain);
    const accessConfig: any = {
      id: mail._id,
      ...mail.toObject(),
      accessConfig: mailAccessConfigModel,
    };

    await this.mailAccessConfigService.update(
      mailAccessConfigModel,
      {
        version: version,
      },
    );
    accessConfig.accessConfig.version = version;

    return {
      accessConfig,
      domainNames,
    };
  }
}
