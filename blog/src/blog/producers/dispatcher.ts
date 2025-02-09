import { EventDispatcher } from '@pe/nest-kit';
import { LeanDocument } from 'mongoose';

import { Populable } from '../../dev-kit-extras/population';
import { BlogEventsEnum } from '../enums';
import { BlogAccessConfigModel, BlogModel, DomainModel } from '../models';
import { WithAccessConfig } from '../../compatibility/types';
import { KubernetesEventEnum } from '@pe/kubernetes-kit/module/kubernetes/enums';

export interface BlogEventsArgsMap {
  [BlogEventsEnum.BlogUpdated]: [
    LeanDocument<WithAccessConfig<Populable<BlogModel, {
      channelSet: { };
      business: { };
    }>>>,
    LeanDocument<WithAccessConfig<Populable<BlogModel, {
      channelSet: { };
      business: { };
    }>>>,
  ];
  [BlogEventsEnum.BlogClone]: [
    LeanDocument<Populable<BlogModel, {
      channelSet: {
        channel: { };
      };
      business: { };
    }>>,
  ];
  [BlogEventsEnum.BlogCreated]: [
    LeanDocument<Populable<BlogModel, {
      channelSet: {
        channel: { };
      };
      business: { };
    }>>,
  ];
  [BlogEventsEnum.BlogRemoved]: [LeanDocument<Populable<BlogModel>>];

  [KubernetesEventEnum.AppAccessCreated]: [
    LeanDocument<Populable<BlogAccessConfigModel>>,
    LeanDocument<Populable<BlogAccessConfigModel>>,
  ];
  [KubernetesEventEnum.AppAccessUpdated]: [
    LeanDocument<Populable<BlogAccessConfigModel>>,
  ];
  [KubernetesEventEnum.AppAccessDeleted]: [
    LeanDocument<Populable<BlogAccessConfigModel>>,
  ];

  [KubernetesEventEnum.DomainCreated]: [
    LeanDocument<Populable<DomainModel>>,
  ];
  [KubernetesEventEnum.DomainUpdated]: [
    LeanDocument<Populable<DomainModel>>,
    LeanDocument<Populable<DomainModel>>,
  ];
  [KubernetesEventEnum.DomainRemoved]: [
    LeanDocument<Populable<DomainModel>>,
  ];
  [KubernetesEventEnum.LinkMask]: [
    any,
  ];
}

export function dispatchWrapperFactory(dispatcher: EventDispatcher): any {
  return async <K extends keyof BlogEventsArgsMap>(key: K, ...args: BlogEventsArgsMap[K]) => {
    await dispatcher.dispatch(key, ...args);
  };
}
