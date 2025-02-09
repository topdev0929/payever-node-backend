import { MappedFolderItemInterface, ScopeEnum } from '@pe/folders-plugin';
import { PopulateOptions } from 'mongoose';

import { CategoriesFixture, CategoryPrototype } from '../fixture-data';

import { BusinessModelLocal } from '../../business';
import { IntegrationModel, IntegrationSubscriptionModel } from '../models';

export function isIntegrationAllowed(
  document: { businessId?: string },
  integrationFixture: IntegrationModel,
  business: BusinessModelLocal,
): boolean {
  let integrationAllowed: boolean = integrationFixture.enabled;

  // is allowed
  if (integrationFixture.allowedBusinesses && integrationFixture.allowedBusinesses.length > 0) {
    integrationAllowed = integrationAllowed &&
      integrationFixture.allowedBusinesses.indexOf(document.businessId) > -1;
  }

  // isn't excluded
  if (business && business.excludedIntegrations.length > 0) {
    integrationAllowed = integrationAllowed &&
      business.excludedIntegrations.indexOf(integrationFixture._id) === -1;
  }

  return integrationAllowed;
}

export const folderMapDocumentFnPopulate: PopulateOptions[] = [
  { path: 'integration'},
  { path: 'business'},
];

export async function folderMapSubscriptionFn(
  integrationSubscription: IntegrationSubscriptionModel,
  options?: { omitParentFolderId: boolean },
): Promise<MappedFolderItemInterface> {
  if (!integrationSubscription.populated('integration')) {
    await integrationSubscription.populate(folderMapDocumentFnPopulate).execPopulate();
  }

  return folderMapPopulatedSubscriptionFn(integrationSubscription, options);
}

export function folderMapPopulatedSubscriptionFn(
  integrationSubscription: IntegrationSubscriptionModel,
  options?: { omitParentFolderId: boolean },
): MappedFolderItemInterface {

  if (!integrationSubscription.integration?.category) {
    return;
  }

  if (!isIntegrationAllowed(
    integrationSubscription,
    integrationSubscription.integration,
    integrationSubscription.business,
  )) {
    return;
  }

  const category: CategoryPrototype = CategoriesFixture.find(
    (item: CategoryPrototype) => item.category === integrationSubscription.integration.category,
  );

  return  {
    _id: integrationSubscription._id,
    businessId: integrationSubscription.businessId,
    category: integrationSubscription.integration.category,
    createdAt: integrationSubscription.createdAt,
    developer: integrationSubscription.integration.installationOptions?.developer,
    developerTranslations: { },
    installed: integrationSubscription.installed,
    integration: integrationSubscription.integration._id,
    name: integrationSubscription.integration.name,
    scope: ScopeEnum.Business,
    title: integrationSubscription.integration.displayOptions?.title,
    titleTranslations: { },
    userId: null,
    wrapperType: integrationSubscription.integration.installationOptions?.wrapperType,
    ...(
      options?.omitParentFolderId ? { } :  { parentFolderId: category?._id || null }
    ),
  } as any;
}
