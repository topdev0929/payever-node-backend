/* tslint:disable:parameters-max-number */
import { Logger, UseGuards } from '@nestjs/common';
import {
  Acl,
  AclActionsEnum,
  MessageBusService,
  MessageInterface,
  RabbitMqClient,
  Roles,
  RolesEnum,
} from '@pe/nest-kit';
import {
  ClientResultInterface,
  ConvertThemeResultInterface,
  EmailClient,
  SizeInterface,
  ThemeDetailsInterface,
} from '@pe/builder-sdk';
import { AES, DecryptedMessage, enc } from 'crypto-js';
import * as cron from 'node-cron';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CustomError, ErrorName } from '../../../common';
import { BusinessModel, BusinessService } from '../../business';
import { Campaign, CreateCampaignInput, UpdateCampaignInput } from '../classes';
import { CampaignStatus } from '../enums';
import { CampaignModel, CampaignsModel } from '../models';
import { CampaignEventsProducer } from '../producers';
import { CampaignService, ThemeService } from '../services';
import { AbstractGqlResolver, GqlAuthGuard } from '@pe/graphql-kit';

const SCHEDULER_TASK_EXPRESSION: string = '0 */1 * * *'; // once a hour
let task: cron.ScheduledTask;

@UseGuards(GqlAuthGuard)
@Resolver('Campaign')
@Roles(RolesEnum.merchant)
export class CampaignResolver extends AbstractGqlResolver {
  constructor(
    private readonly messageBusService: MessageBusService,
    private readonly logger: Logger,
    private readonly campaignEventsProducer: CampaignEventsProducer,
    private readonly campaignService: CampaignService,
    private readonly loggerInject: Logger,
    private readonly themeService: ThemeService,
    private readonly rabbitClient: RabbitMqClient,
    private readonly businessService: BusinessService,
  ) {
    super();

    if (!task) {
      task = cron.schedule(SCHEDULER_TASK_EXPRESSION, async () => {
        const date: Date = new Date();
        date.setHours(date.getHours() - 4);
        this.logger.log('Delete not saved campaigns older than ' + date.toISOString());
        const campaigns: CampaignModel[] = await this.campaignService.getNotSavedCampaigns(date);
        await this.campaignService.deleteNotSavedCampaigns(date);
        for (const campaign of campaigns) {
          this.campaignEventsProducer.applicationRemoved(campaign.business, campaign.id).catch();
        }
      });
    }
  }

  @Query()
  @Acl({ microservice: 'marketing', action: AclActionsEnum.read})
  public async getCampaigns(
    @Args('businessId') businessId: string,
    @Args('status') status: CampaignStatus,
    @Args('page') page?: number,
    @Args('limit') limit?: number,
  ): Promise<CampaignsModel> {
    const business: BusinessModel = await this.getBusinessModel(businessId);

    return this.campaignService.getCampaigns(business, status, page, limit);
  }

  @Query()
  @Acl({ microservice: 'marketing', action: AclActionsEnum.read})
  public async getCampaign(
    @Args('businessId') businessId: string,
    @Args('id') id: string,
  ): Promise<CampaignModel> {
    const business: BusinessModel = await this.getBusinessModel(businessId);
    await this.checkIfCampaignFromOtherBusiness(business, id);

    return this.getCampaignModel(id);
  }

  @Query()
  @Acl({ microservice: 'marketing', action: AclActionsEnum.read})
  public async getCampaignsCount(
    @Args('businessId') businessId: string,
    @Args('status') status?: CampaignStatus,
  ): Promise<number> {
    const business: BusinessModel = await this.getBusinessModel(businessId);

    return this.campaignService.getCampaignsCount(business, status);
  }

  @Query()
  @Acl({ microservice: 'marketing', action: AclActionsEnum.read})
  public async getCampaignTemplate(@Args('businessId') businessId: string, @Args('id') id: string): Promise<string> {
    const business: BusinessModel = await this.getBusinessModel(businessId);
    await this.checkIfCampaignFromOtherBusiness(business, id);
    const campaign: CampaignModel = await this.getCampaignModel(id);
    if (campaign.template) {
      const bytes: DecryptedMessage = AES.decrypt(campaign.template, 'marketing');

      return bytes.toString(enc.Utf8);
    }

    return null;
  }

  @Query()
  @Acl({ microservice: 'marketing', action: AclActionsEnum.read})
  public async extractThemeDetails(
    @Args('businessId') businessId: string,
    @Args('id') id: string,
    @Args('accessToken') accessToken: string,
    @Args('refreshToken') refreshToken: string,
    @Args('loginData') loginData?: string, // Should be removed
    @Args('screenSizes') screenSizes?: SizeInterface[],
  ): Promise<string> {
    const business: BusinessModel = await this.getBusinessModel(businessId);
    await this.checkIfCampaignFromOtherBusiness(business, id);
    const campaign: CampaignModel = await this.getCampaignModel(id);

    this.logger.log(`Extracting theme details was started for campaign ${id}`);
    const themeDetails: ThemeDetailsInterface[] = await this.themeService.extractThemeDetails({
      accessToken, businessId, campaign, clientUrl: '', loginData, refreshToken, screenSizes,
    });

    return JSON.stringify(themeDetails);
  }

  @Mutation()
  @Acl({ microservice: 'marketing', action: AclActionsEnum.create})
  public async createCampaign(
    @Args('businessId') businessId: string,
    @Args('data') data: CreateCampaignInput,
  ): Promise<CampaignModel> {
    const business: BusinessModel = await this.getBusinessModel(businessId);
    const campaign: CampaignModel = await this.campaignService.createCampaign(business, data);
    await this.campaignEventsProducer.applicationCreated(campaign);
    await this.campaignEventsProducer.campaignCreated(campaign);

    return campaign;
  }

  @Mutation()
  @Acl({ microservice: 'marketing', action: AclActionsEnum.update})
  public async updateCampaign(
    @Args('businessId') businessId: string,
    @Args('id') id: string,
    @Args('data') data: UpdateCampaignInput,
  ): Promise<CampaignModel> {
    const business: BusinessModel = await this.getBusinessModel(businessId);
    await this.checkIfCampaignExists(id);
    await this.checkIfCampaignFromOtherBusiness(business, id);

    return this.campaignService.updateCampaign(id, data);
  }

  @Mutation()
  @Acl({ microservice: 'marketing', action: AclActionsEnum.delete})
  public async deleteCampaigns(
    @Args('businessId') businessId: string,
    @Args('ids') ids: string[],
  ): Promise<void> {
    if (!ids || !Array.isArray(ids)) {
      throw new CustomError(ErrorName.IdsNotValid);
    }
    const business: BusinessModel = await this.getBusinessModel(businessId);
    for (const id of ids) {
      await this.checkIfCampaignExists(id);
      await this.checkIfCampaignFromOtherBusiness(business, id);
    }
    await this.campaignService.deleteCampaigns(business.id, ids);
    for (const id of ids) {
      await this.campaignEventsProducer.applicationRemoved(business.id, id);
    }
  }

  @Mutation()
  @Acl({ microservice: 'marketing', action: AclActionsEnum.update})
  public async convertTheme(
    @Args('businessId') businessId: string,
    @Args('id') id: string,
    @Args('accessToken') accessToken: string,
    @Args('refreshToken') refreshToken: string,
    @Args('clientUrl') clientUrl: string,
    @Args('client') client: string,
    @Args('loginData') loginData?: string, // Should be removed
    @Args('screenSizes') screenSizes?: SizeInterface[],
  ): Promise<string> {
    const business: BusinessModel = await this.getBusinessModel(businessId);
    await this.checkIfCampaignFromOtherBusiness(business, id);
    const campaign: CampaignModel = await this.getCampaignModel(id);

    this.logger.log(`Converting theme was started for campaign ${id}`);
    const result: ConvertThemeResultInterface = await this.themeService.convertTheme({
      accessToken, businessId, campaign, clientUrl, loginData, refreshToken, screenSizes,
    });

    const templateEncrypted: string = AES
      .encrypt(this.getClientTemplate(result, EmailClient.Other), 'marketing')
      .toString();
    await this.campaignService.updateCampaign(id, { template: templateEncrypted });

    return this.getClientTemplate(result, client as EmailClient);
  }

  @Mutation()
  @Acl({ microservice: 'marketing', action: AclActionsEnum.update})
  public async sendEmail(
    @Args('businessId') businessId: string,
    @Args('id') id: string,
    @Args('accessToken') accessToken: string,
    @Args('refreshToken') refreshToken: string,
    @Args('clientUrl') clientUrl: string,
    @Args('loginData') loginData?: string, // Should be removed
    @Args('contacts') contacts?: string[],
    @Args('screenSizes') screenSizes?: SizeInterface[],
  ): Promise<boolean> {
    this.logger.log('sendEmail mutation');

    const business: BusinessModel = await this.getBusinessModel(businessId);
    await this.checkIfCampaignFromOtherBusiness(business, id);
    const campaign: CampaignModel = await this.getCampaignModel(id);

    const contactsList: string[] = contacts || campaign.contacts || null;
    if (!contactsList || contactsList.length === 0) {
      throw new CustomError(ErrorName.ContactsListEmpty);
    }

    const theme: ConvertThemeResultInterface = await this.themeService.convertTheme({
      accessToken, businessId, campaign, clientUrl, loginData, refreshToken, screenSizes,
    });

    const templateEncrypted: string = AES
      .encrypt(this.getClientTemplate(theme, EmailClient.Other), 'marketing')
      .toString();
    await this.campaignService.updateCampaign(id, { template: templateEncrypted});

    const separatedContacts: Map<string, string[]> = this.separateContactsList(contactsList);

    separatedContacts.forEach(async (value: string[], key: string) => {
      this.logger.log(`Send email to contacts: ${value.join(', ')}`);

      value.forEach(async (address: string) => {
        const message: MessageInterface = this.messageBusService.createMessage('payever.event.mailer.send', {
          html: this.getClientTemplate(theme, key as EmailClient), isProd: true, subject: campaign.name, to: address,
        });

        await this.rabbitClient.send(
          {
            channel: 'payever.event.mailer.send', exchange: 'async_events',
          },
          message,
        );
      });
    });

    return true;
  }

  private async getBusinessModel(businessId: string): Promise<BusinessModel> {
    const business: BusinessModel = await this.businessService.findOneById(businessId);
    if (!business) {
      throw new CustomError(ErrorName.ItemNotFound, { itemName: 'business', id: businessId });
    }

    return business;
  }

  private async checkIfCampaignExists(campaignId: string): Promise<void> {
    const exists: boolean = await this.campaignService.isCampaignExists(campaignId);
    if (!exists) {
      throw new CustomError(ErrorName.ItemNotFound, { itemName: 'campaign', id: campaignId });
    }
  }

  private async getCampaignModel(campaignId: string): Promise<CampaignModel> {
    const campaign: CampaignModel = await this.campaignService.getCampaign(campaignId);
    if (!campaign) {
      throw new CustomError(ErrorName.ItemNotFound, { itemName: 'campaign', id: campaignId });
    }

    return campaign;
  }

  private async checkIfCampaignFromOtherBusiness(business: BusinessModel, campaignId: string): Promise<void> {
    if (!business.campaigns || business.campaigns.indexOf(campaignId as any) === -1) {
      const campaign: CampaignModel = await this.campaignService.getCampaign(campaignId);

      if (!campaign) {
        return ;
      }

      if (campaign.business !== business.id) {
        throw new CustomError(
          ErrorName.ItemNotInBusiness, {
            businessId: business._id, itemId: campaignId, itemName: 'campaign',
          },
        );
      }
    }
  }

  private checkIfCampaignInBusiness(business: BusinessModel, campaignId: string): void {
    if (!business.campaigns || business.campaigns.indexOf(campaignId as any) === -1) {
      throw new CustomError(
        ErrorName.ItemNotInBusiness, {
          businessId: business._id, itemId: campaignId, itemName: 'campaign',
        },
      );
    }
  }

  private separateContactsList(contacts: string[]): Map<string, string[]> {
    const contactsMap: Map<string, string[]> = new Map<string, string[]>();
    const contactsList: string[] = contacts && contacts.length > 0 ? [ ...contacts ] : [];

    Object.keys(EmailClient).map((key: string) => EmailClient[key]).forEach((client: EmailClient) => {
      switch (client) {
        case EmailClient.Gmail: {
          contactsMap.set(client, contactsList.filter((contact: string) =>
            contact.toLowerCase().indexOf('gmail') !== -1));
          break;
        }
        case EmailClient.Yahoo: {
          contactsMap.set(client, contactsList.filter((contact: string) =>
            contact.toLowerCase().indexOf('yahoo') !== -1));
          break;
        }
        case EmailClient.Other: {
          contactsMap.set(client, contactsList.filter((contact: string) =>
            contact.toLowerCase().indexOf('gmail') === -1 && contact.toLowerCase().indexOf('yahoo') === -1));
          break;
        }
      }
    });

    return contactsMap;
  }

  private getClientTemplate(result: ConvertThemeResultInterface, client: EmailClient): string {
    if (result && result.clientsResult) {
      const clientResult: ClientResultInterface
        = result.clientsResult.find((item: ClientResultInterface) => item.client === client);

      return clientResult ? clientResult.template : null;
    } else {
      return null;
    }
  }
}
