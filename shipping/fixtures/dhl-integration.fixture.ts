import { IntegrationServiceInterface } from '../src/integration';

export const dhlIntegrationServices: IntegrationServiceInterface[] = [
  {
    code: 'EXP',
    displayName: 'shipping.integration.service.dhl.express',
  },
  {
    code: 'BP',
    displayName: 'shipping.integration.service.dhL.mailbox',
  },
  {
    code: 'PS',
    displayName: 'shipping.integration.service.dhL.service_point',
  },
]
