import { HttpService, Injectable, Logger } from '@nestjs/common';
import { CampaignModel, ScheduleModel } from '../models';
import { SendEmailDto } from '../dto';
import { environment, RabbitBinding } from '../../../environments';
import { RabbitMqClient } from '@pe/nest-kit';
import { AttachmentInterface, EmailTemplateInterface } from '../interfaces';
import * as validUrl from 'valid-url';
import { CampaignService } from './campaign.service';
import { MailAccessConfigModel, MailModel } from '../../mail/models';
import { MailAccessConfigService, MailService } from '../../mail/services';
import { ScheduleIntervalEnum, ScheduleStatusEnum, ScheduleTypeEnum } from '../enums';
import { BrowserService } from './browser.service';
import { BrowserPageRedisService } from './browser-page-redis.service';
import * as fs from 'fs';
import { DateHelper } from '../helpers/date-helper';
import { ScheduleService } from './schedule.service';
import * as puppeteer from 'puppeteer';

const browserPagesPool: {
  [key: string]: puppeteer.Page;
} = { };
let browserContext: puppeteer.Context;

@Injectable()
export class EmailService {
  constructor(
    private readonly rabbitMqClient: RabbitMqClient,
    private readonly httpService: HttpService,
    private readonly campaignService: CampaignService,
    private readonly scheduleService: ScheduleService,
    private readonly mailService: MailService,
    private readonly mailAccessConfigService: MailAccessConfigService,
    private readonly browserService: BrowserService,
    private readonly browserPageRedisService: BrowserPageRedisService,
    private readonly logger: Logger,
  ) {
    browserPagesPool.main = this.browserService.getPage();
    browserContext = this.browserService.getContext();
  }

  public async sendEmail(campaign: CampaignModel): Promise<ScheduleStatusEnum> {
    if (!campaign.template) {
      await this.noTemplate(campaign);

      return ScheduleStatusEnum.Process;
    }

    return this.sendingEmail(campaign);
  }

  public async sendFromThemeId(themeId: string): Promise<void> {
    const campaignModels: any[] = await this.campaignService.getProcessCampaignByTheme(themeId);
    for (let campaign of campaignModels) {
      const mail: MailModel = await this.mailService.findByBusinessId(campaign.business);
      const accessConfig: MailAccessConfigModel = await this.mailAccessConfigService.findByMail(mail);
      const mailWebsiteUrl: string = `https://${accessConfig.internalDomain}.${environment.mailDomain}`;

      const lock: string = await this.browserPageRedisService.lock(themeId);
      let page: puppeteer.Page;

      if (lock) {
        if (!browserPagesPool[lock]) {
          // set new page to page pool
          browserPagesPool[lock] = await browserContext.newPage();
          await this.browserPageRedisService.setPoolKeyTimeout(lock);
        }
        page = browserPagesPool[lock];
      } else {
        // page pool is locked, create temporary new page
        page = await browserContext.newPage();
        page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
      }
      let blobPromises: any[] = [];
      let blobUrls: string[] = [];

      await page.setRequestInterception(true);
      page.on('request', async (request: any) => {
        const data: any = await this.interceptor(request, blobPromises, blobUrls);
        blobPromises = data.blobPromises;
        blobUrls = data.blobUrls;
      });
      page.setViewport({ width: 1200, height: 1080 });

      await page.goto(mailWebsiteUrl, {
        timeout: 0,
        waitUntil: 'networkidle2',
      });

      const blobDatas: any[] = await Promise.all(blobPromises);
      let html: string = await page.content();

      try {
        html = await this.addInlineCss(html);
      } catch (e) {
        this.logger.log(e);
      }

      try {
        html = this.cleanUpHtml(html);
      } catch (e) {
        this.logger.log(e);
      }

      const email: EmailTemplateInterface = await this.replaceImgTags(html, blobDatas, blobUrls);
      campaign = await this.campaignService.setAttachments(campaign._id, email);

      for (const schedule of campaign.schedules) {
        const status: ScheduleStatusEnum = await this.sendingEmail(campaign);
        await this.setStatus(schedule, status);
      }
    }
  }

  private async interceptor(request: any, blobPromises: any[], blobUrls: string[]): Promise<{
    blobPromises: any[],
    blobUrls: string[],
  }> {
    try {
      if (request.resourceType() === 'image') {
        if (request.url().indexOf('blob') > -1 && request.url().indexOf('builder') > -1) {
          blobUrls.push(request.url());
          blobPromises.push(request.response());
          request.abort();
        }
        request.continue();
      } else {
        request.continue();
      }
    } catch (e) {
      this.logger.log(e);
    }

    return {
      blobPromises,
      blobUrls,
    };
  }

  private async addInlineCss(html: string): Promise<string> {
    html = html.replace(/<style[^<]*?><\/style>/gms, ``);

    const quill: string = fs.readFileSync('./static/quill.min.scss', { encoding : 'utf8' });
    html = html.replace(
      /<\/head>/gm,
      `<style type="text/css">${quill}</style><meta name="color-scheme" content="light only"></head>`,
    );

    return html;
  }

  private cleanUpHtml(html: string): string {
    html = html.replace(/_ng[-a-z0-9]+="[^"]*"/gm, '');
    html = html.replace(/<peb-checkout(.+?)peb-checkout>/gms, '');
    html = html.replace(/<script(.+?)script>/gms, '');
    html = html.replace(/<path(.+?)path>/gms, '');
    html = html.replace(/<mat-spinner(.+?)mat-spinner>/gms, '');
    html = html.replace(/<svg(.+?)svg>/gms, '');
    html = html.replace(/<peb-[\w\-]+/gm, '<div');
    html = html.replace(/\/peb-[\w\-]+>/gm, '/div>');

    html = html.replace(/\[_ngcontent\-serverApp\-c84\]/gms, '');

    return html;
  }

  private async setStatus(scheduleId: string, status: ScheduleStatusEnum): Promise<void> {
    let schedule: ScheduleModel = await this.scheduleService.findById(scheduleId);
    schedule.history.push(new Date());
    schedule.status = status;
    if (schedule.type === ScheduleTypeEnum.PeriodicAfterDate) {
      schedule = this.setNewDate(schedule);
      if (status === ScheduleStatusEnum.Fulfilled && schedule.recurring.target) {
        schedule.recurring.fulfill = schedule.recurring.fulfill ? schedule.recurring.fulfill + 1 : 1;
        if (schedule.recurring.fulfill === schedule.recurring.target) {
          schedule.status = ScheduleStatusEnum.Fulfilled;
        }
      }
    }

    await schedule.save();
  }

  private setNewDate(schedule: ScheduleModel): ScheduleModel {
    switch (true) {
      case schedule.interval.type === ScheduleIntervalEnum.Hour:
        schedule.date = DateHelper.addHours(schedule.interval.number);
        break;
      case schedule.interval.type === ScheduleIntervalEnum.Day:
        schedule.date = DateHelper.addDays(schedule.interval.number);
        break;
      case schedule.interval.type === ScheduleIntervalEnum.Week:
        schedule.date = DateHelper.addWeeks(schedule.interval.number);
        break;
      case schedule.interval.type === ScheduleIntervalEnum.Month:
        schedule.date = DateHelper.addMonths(schedule.interval.number);
        break;
    }

    return schedule;
  }

  private async noTemplate(campaign: CampaignModel): Promise<void> {
    const application: MailModel = await this.mailService.findByBusinessId(campaign.business);

    return this.rabbitMqClient.send(
      {
        channel: RabbitBinding.MailRequestTheme,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.MailRequestTheme,
        payload: {
          application: application.id,
          theme: campaign.themeId,
        },
      },
    );
  }

  private async replaceImgTags(html: string, blobDatas: any[], blobUrls: string[]): Promise<EmailTemplateInterface> {
    const regex: RegExp = /background-image: url\(&quot;([^>"]+)&quot;\)/gm;
    let images: string[] = [];
    let m: RegExpExecArray;
    /* tslint:disable:no-conditional-assignment */
    while ((m = regex.exec(html)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      images.push(m[1]);
    }

    images = images.filter((value: string, index: number, self: string[]) => {
      return self.indexOf(value) === index;
    });
    const attachments: AttachmentInterface[] = [];
    let i: number = 1;
    for (const image of images) {
      if (validUrl.isUri(image)) {
        this.logger.log(`processing image "${image}"`);
        if (image.indexOf('blob') > -1) {
          try {
            const blobUrl: any = blobUrls.shift();
            const regex2: RegExp = new RegExp(`&quot;${image}&quot;`, 'g');
            html = html.replace(regex2, `'${blobUrl}'`);

            i++;

          } catch (e) {
            this.logger.log(e);
          }
        }
      }
    }

    const regex3: RegExp = new RegExp(`background-image:`, 'g');
    html = html.replace(regex3, `height:100%; background-image:`);

    return {
      attachments: [],
      html: html,
    };
  }

  private async sendingEmail(campaign: CampaignModel): Promise<ScheduleStatusEnum> {
    const data: SendEmailDto = {
      attachments: campaign.attachments,
      from: campaign.from,
      html: campaign.template,
      subject: campaign.name,
      to: campaign.contacts,
    };

    await this.rabbitMqClient.send(
      {
        channel: RabbitBinding.SendEmail,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.SendEmail,
        payload: data,
      },
    );

    return ScheduleStatusEnum.Fulfilled;
  }

  private async deleteUnusedPool(): Promise<any> {
    for (const [key] of Object.entries(browserPagesPool)) {
      if (key !== 'main' && !await this.browserPageRedisService.getPoolKey(key)) {
        delete browserPagesPool[key];
      }
    }
  }
}
