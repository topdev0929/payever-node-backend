import { DocumentDefinition } from 'mongoose';
import { IntegrationModel } from '@pe/synchronizer-kit';

export const Integrations: Array<DocumentDefinition<IntegrationModel>> = [{
  _id: '314039c0-2b82-46cb-867f-234186399816',
  name: 'external-contacts-storage',
  category: 'contacts-synchronization',
}];
