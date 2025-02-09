import { Injectable } from '@nestjs/common';

import { EventDispatcher, EventListener } from '@pe/nest-kit';
import {
  EsDocumentHookWrapper,
  EsFolderItemInterface,
  EsFolderItemPrePrototypeInterface,
  FoldersEventsEnum,
  ListQueryDto,
  ElasticFilterBodyInterface,
  ScopeEnum,
  FoldersElasticSearchService,
  FoldersService,
  FolderDocument,
} from '@pe/folders-plugin';
import { BusinessService } from '@pe/business-kit';
import { BusinessModelLocal } from '../../business';
import { IntegrationModel, IntegrationSubscriptionModel } from '../models';
import {
  isIntegrationAllowed,
} from '../transformers';
import { IntegrationService, IntegrationSubscriptionService, IntegrationWrapperSubscriptionService } from '../services';
import { TranslationService } from '@pe/translations-sdk';
import { IntegrationEventsEnum, IntegrationSubscriptionEventsEnum } from '../enum';
import { IntegrationWrapperConfigs } from '../config/integration-wrappers.config';
@Injectable()
export class FolderDocumentsListener {
  constructor(
    private readonly translationService: TranslationService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly businessService: BusinessService<BusinessModelLocal>,
    private readonly integrationService: IntegrationService,
    private readonly integrationSubscriptionService: IntegrationSubscriptionService,
    private readonly integrationWrapperService: IntegrationWrapperSubscriptionService,
    private readonly foldersElasticSearchService: FoldersElasticSearchService,
    private readonly foldersService: FoldersService,
  ) {
  }

  @EventListener(FoldersEventsEnum.ElasticBeforeIndexDocument)
  public async elasticBeforeIndexDocument(
    elasticSearchElementDto: EsDocumentHookWrapper<EsFolderItemPrePrototypeInterface>,
  ): Promise<void> {
    elasticSearchElementDto.document = {
      ...elasticSearchElementDto.document,
      developerTranslations: await this.translationService.getTranslations(
        elasticSearchElementDto.document.developer,
      ),
      titleTranslations: await this.translationService.getTranslations(
        elasticSearchElementDto.document.title,
      ),
    };
  }

  @EventListener(FoldersEventsEnum.ElasticProcessAllSearchResult)
  public async elasticProcessSearchResult(
    elasticSearchResultDto: EsFolderItemInterface[],
  ): Promise<void> {
    const integrationFixture: IntegrationModel[] =
      await this.integrationService.findAll();
    for (let index = 0; index < elasticSearchResultDto.length; index++) {
      const valEs = elasticSearchResultDto[index];
      if (valEs) {
        const elasticDocument: EsFolderItemInterface = valEs;
        const integration: IntegrationModel = integrationFixture.find(( item : IntegrationModel ) => {
          return  item._id === elasticDocument.integration;
        });

        const business: BusinessModelLocal = await this.businessService.findOneById(elasticDocument.businessId);
        if (
          integration &&
          isIntegrationAllowed(elasticDocument, integration, business) &&
          integration.enabled
        ) {
          if (integration.installationOptions?.wrapperType &&
              integration.installationOptions.wrapperType.trim() !== '') {
              elasticSearchResultDto = await this.moveIntegrationToWrapper(
                elasticSearchResultDto,
                integration,
                elasticDocument,
              );
          } else {
            const elasticIndex: number = elasticSearchResultDto.indexOf(valEs);
            elasticSearchResultDto[elasticIndex] = {
              ...integration.toObject(),
              ...elasticDocument,
              name: integration.name,
            };
          }
        } else {
          elasticSearchResultDto.splice(index, 1);
          index--;
        }
      }
    }
  }

  @EventListener(IntegrationEventsEnum.IntegrationSync)
  public async syncElasticItems(
    businessId: string,
  ): Promise<void> {
    await this.elasticBeforeGetResults(null, null, businessId, true);
  }

  @EventListener(FoldersEventsEnum.ElasticBeforeGetResults)
  public async elasticBeforeGetResults(
    listDto: ListQueryDto,
    filter: ElasticFilterBodyInterface,
    businessId: string,
    ignoreRoot: boolean = false,
  ): Promise<void> {
    const business: BusinessModelLocal = await this.businessService.findOneById(businessId);
    const integrations: IntegrationModel[] = await this.integrationService.findAll();
    const integrationSubscriptions: IntegrationSubscriptionModel[] =
      await this.integrationSubscriptionService.findBusinessSubscriptions(businessId);

    const allowedIntegrations: string[] = [];

    for (const integration of integrations) {

      // is allowed
      const allowedBusiness: boolean = (integration.allowedBusinesses && integration.allowedBusinesses.length) ?
        integration.allowedBusinesses.includes(business._id) :
        true;

      // isn't excluded
      const notExcludedIntegration: boolean = (business.excludedIntegrations && business.excludedIntegrations.length)
        ? !business.excludedIntegrations.includes(integration._id)
        : true;

      const subscribed: boolean = integrationSubscriptions.findIndex(
        (sub: IntegrationSubscriptionModel) => sub.integration === integration._id,
      ) > -1;

      if (allowedBusiness && notExcludedIntegration && !subscribed) {
        allowedIntegrations.push(integration._id);
        await this.integrationSubscriptionService.findOrCreateSubscription(integration, business, true);
      }
    }

    const exportedItems: EsFolderItemInterface[] = await this.getExportedIntegrationSubscriptions(business._id);
    const rootFolder: FolderDocument = await this.foldersService.getDefaultScopeRootFolder();

    const exportedItemsMap: { [key: string]: boolean } = exportedItems.reduce(
      (obj: { [key: string]: boolean }, exportedItem: EsFolderItemInterface) => {
        // this condition checks if items are indexed in root folder or not
        const isIndexed: boolean = ignoreRoot ? exportedItem.parentFolderId !== rootFolder._id : true;

        return { ...obj, [exportedItem.integration]: isIndexed };
      },
      { },
    );

    for (const integrationId of allowedIntegrations) {
      if (exportedItemsMap[integrationId]) {
        continue;
      }

      const subscription: IntegrationSubscriptionModel = await this.integrationSubscriptionService.findSubscription(
        integrationId,
        business.id,
      );

      await this.eventDispatcher.dispatch(
        IntegrationSubscriptionEventsEnum.IntegrationSubscriptionCreated,
        business,
        subscription,
        true,
      );
    }
  }

  public async getExportedIntegrationSubscriptions(businessId: string): Promise<EsFolderItemInterface[]> {
    const body: any = {
      query: {
        bool: {
          must: [{
            match_phrase: {
              businessId: businessId,
            },
          }, {
            match_phrase: {
              scope: ScopeEnum.Business,
            },
          }],
        },
      },
      size: 1000,
    };

    return this.foldersElasticSearchService.searchAll(body);
  }

  private async moveIntegrationToWrapper(
    elasticSearchResultDto: EsFolderItemInterface[],
    integration: IntegrationModel,
    elasticDocument: EsFolderItemInterface,
  ): Promise<EsFolderItemInterface[]> {
    const wrapper: EsFolderItemInterface = elasticSearchResultDto.find((e: EsFolderItemInterface) =>
      e.wrapperType === integration.installationOptions?.wrapperType && e.wrappedIntegrations);
    const installed: boolean = (await this.integrationWrapperService.getWrapperByTypeAndBusiness(
      integration.installationOptions?.wrapperType, elasticDocument.businessId, false))?.installed;
    if (!wrapper) {
      const wrapperConfig: any =
        IntegrationWrapperConfigs.find((w: any) => w.wrapperType === integration.installationOptions?.wrapperType);
      elasticSearchResultDto[elasticSearchResultDto.indexOf(elasticDocument)] = {
        _id: wrapperConfig._id,
        installed: installed,
        isFolder: false,
        parentFolderId: elasticDocument.parentFolderId,
        scope: elasticDocument.scope,
        serviceEntityId: null,
        wrappedIntegrations: [
          {
            ...integration.toObject(),
            ...elasticDocument,
            installed: installed,
            name: integration.name,
          },
        ],
        ...wrapperConfig,
      };
    } else {
      const duplicateWrapper: any = wrapper.wrappedIntegrations.find(
        (wi: any) => wi.wrapperType === elasticDocument.wrapperType);
      if (!duplicateWrapper) {
        wrapper.wrappedIntegrations.push({
          ...integration.toObject(),
          ...elasticDocument,
          installed: installed,
          name: integration.name,
        });
      }
    }

    return elasticSearchResultDto;
  }
}
