import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient, RabbitMqRPCClient } from '@pe/nest-kit';
import { ApplicationThemeDto, CompiledThemeWithPagesInterface } from '@pe/builder-theme-kit';
import { CompiledThemeService } from '@pe/builder-theme-kit/module/service';

import { AffiliateBrandingModel, AffiliateProgramModel, BusinessAffiliateModel } from '../models';
import { AffiliatesRabbitMessagesEnum } from '../enums';

import { AppWithAccessConfigDto } from '../dto';

@Injectable()
export class AffiliatesMessagesProducer {
  constructor (
    private readonly rabbitClient: RabbitMqClient,
    private readonly compiledThemeService: CompiledThemeService,
    private readonly rabbitMqRPCClient: RabbitMqRPCClient,
    private readonly logger: Logger,
  ) { }

  public async sendAffiliateProgramCreatedMessage(affiliateProgram: AffiliateProgramModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: AffiliatesRabbitMessagesEnum.AffiliateProgramCreated,
        exchange: 'async_events',
      },
      {
        name: AffiliatesRabbitMessagesEnum.AffiliateProgramCreated,
        payload: {
          ...affiliateProgram.toObject(),
          business: {
            id: affiliateProgram.business,
          },
          id: affiliateProgram._id,
        },
      },
    );
  }

  public async sendAffiliateProgramUpdatedMessage(affiliateProgram: AffiliateProgramModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: AffiliatesRabbitMessagesEnum.AffiliateProgramUpdated,
        exchange: 'async_events',
      },
      {
        name: AffiliatesRabbitMessagesEnum.AffiliateProgramUpdated,
        payload: {
          ...affiliateProgram.toObject(),
          business: {
            id: affiliateProgram.business,
          },
          id: affiliateProgram._id,
        },
      },
    );
  }

  public async sendAffiliateProgramRemovedMessage(affiliateProgram: AffiliateProgramModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: AffiliatesRabbitMessagesEnum.AffiliateProgramRemoved,
        exchange: 'async_events',
      },
      {
        name: AffiliatesRabbitMessagesEnum.AffiliateProgramRemoved,
        payload: {
          ...affiliateProgram.toObject(),
          business: {
            id: affiliateProgram.business,
          },
          id: affiliateProgram._id,
        },
      },
    );
  }

  public async sendAffiliateProgramExportedMessage(affiliateProgram: AffiliateProgramModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: AffiliatesRabbitMessagesEnum.AffiliateProgramExported,
        exchange: 'async_events',
      },
      {
        name: AffiliatesRabbitMessagesEnum.AffiliateProgramExported,
        payload: {
          ...affiliateProgram.toObject(),
          business: {
            id: affiliateProgram.business,
          },
          id: affiliateProgram._id,
        },
      },
    );
  }

  public async sendBusinessAffiliateCreatedMessage(businessAffiliate: BusinessAffiliateModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: AffiliatesRabbitMessagesEnum.BusinessAffiliateCreated,
        exchange: 'async_events',
      },
      {
        name: AffiliatesRabbitMessagesEnum.BusinessAffiliateCreated,
        payload: {
          affiliate: {
            email: businessAffiliate.affiliate.email,
            firstName: businessAffiliate.affiliate.firstName,
            id: businessAffiliate.affiliate.id,
          },
          business: {
            id: businessAffiliate.businessId,
          },
          id: businessAffiliate.id,
        },
      },
    );
  }

  public async sendBusinessAffiliateDeletedMessage(businessAffiliate: BusinessAffiliateModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: AffiliatesRabbitMessagesEnum.BusinessAffiliateDeleted,
        exchange: 'async_events',
      },
      {
        name: AffiliatesRabbitMessagesEnum.BusinessAffiliateDeleted,
        payload: {
          affiliate: {
            id: businessAffiliate.affiliate.id,
          },
          id: businessAffiliate.id,
        },
      },
    );
  }

  public async sendAffiliateBrandingMessage(
    eventName: AffiliatesRabbitMessagesEnum, 
    affiliateBranding: AffiliateBrandingModel,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload: {
          ...affiliateBranding,
          business: {
            id: affiliateBranding.business,
          },
          id: affiliateBranding._id || affiliateBranding.id,
        },
      },
    );
  }

  public async sendAffiliateBrandingRpcMessage(
    eventName: AffiliatesRabbitMessagesEnum, 
    affiliateBranding: AffiliateBrandingModel,
  ): Promise<void> {
    if (!affiliateBranding) {
      return;
    }

    await this.rabbitMqRPCClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload: {
          ...affiliateBranding,
          business: {
            id: affiliateBranding.business,
          },
          id: affiliateBranding._id || affiliateBranding.id,
        },
      },
      {
        responseType: 'json',
      },
    ).catch((error: any) => {
      this.logger.error(
        {
          error: error.message,
          message: 'Failed affiliate RPC call',
          routingKey: eventName,
        },
        error.stack,
        'AffiliatesMessagesProducer',
      );
    });
  }


  public async publishAffiliateData(
    wsKey: string,
    applicationTheme: ApplicationThemeDto,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: AffiliatesRabbitMessagesEnum.AffiliateThemePublished,
        exchange: 'async_events',
      },
      {
        name: AffiliatesRabbitMessagesEnum.AffiliateThemePublished,
        payload: {
          applicationTheme: applicationTheme,
          wsKey: wsKey,
        },
      },
    );
  }

  public async publishAffiliateDataAllPages(
    domainNames: string[],
    accessConfig: AppWithAccessConfigDto,
    applicationId: string,
    wsKey: string,
  ): Promise<void> {
    const compiledTheme: CompiledThemeWithPagesInterface
      = await this.compiledThemeService.getCompiledThemeWithContentLessPages(applicationId);
    await this.rabbitClient.send(
      {
        channel: AffiliatesRabbitMessagesEnum.AffiliateThemePublishedAllPages,
        exchange: 'async_events',
      },
      {
        name: AffiliatesRabbitMessagesEnum.AffiliateThemePublishedAllPages,
        payload: {
          app: accessConfig,
          domains: domainNames,
          theme: compiledTheme,
          wsKey: wsKey,
        },
      },
    );
  }
}
