import { InteractionObject, Matchers } from '@pact-foundation/pact';

const authorizationId: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const UUID_REGEXP: string = '[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}';

export class InventoryInteractions {
  public static getSyncInventoryInteraction(): InteractionObject {
    return {
      state: 'Authorization exists and connected',
      uponReceiving: 'Request to amazon to sync inventory',
      withRequest: {
        method: 'POST',
          path: Matchers.term({
          generate: `/api/action/sync-inventory/${authorizationId}`,
          matcher: `/api/action/sync-inventory/${UUID_REGEXP}`,
        }),
        headers: {},
      },
      willRespondWith: {
        status: 200,
          body: '',
      },
    };
  }

  public static getAddInventoryInteraction(): InteractionObject {
    return {
      state: 'Authorization exists and connected',
      uponReceiving: 'Request to amazon to add inventory',
      withRequest: {
        method: 'PATCH',
        path: Matchers.term({
          generate: `/api/action/add-inventory/${authorizationId}`,
          matcher: `/api/action/add-inventory/${UUID_REGEXP}`,
        }),
        body: Matchers.like({
          sku: 'test_sku',
          stock: 10,
        }),
        headers: {},
      },
      willRespondWith: {
        status: 200,
        body: '',
      },
    };
  }

  public static getSubtractInventoryInteraction(): InteractionObject {
    return {
      state: 'Authorization exists and connected',
      uponReceiving: 'Request to amazon to subtract inventory',
      withRequest: {
        method: 'PATCH',
        path: Matchers.term({
          generate: `/api/action/subtract-inventory/${authorizationId}`,
          matcher: `/api/action/subtract-inventory/${UUID_REGEXP}`,
        }),
        body: Matchers.like({
          sku: 'test_sku',
          stock: 10,
        }),
        headers: {},
      },
      willRespondWith: {
        status: 200,
        body: '',
      },
    };
  }

  public static getSetInventoryInteraction(): InteractionObject {
    return {
      state: 'Authorization exists and connected',
      uponReceiving: 'Request to amazon to set inventory',
      withRequest: {
        method: 'PATCH',
        path: Matchers.term({
          generate: `/api/action/set-inventory/${authorizationId}`,
          matcher: `/api/action/set-inventory/${UUID_REGEXP}`,
        }),
        body: Matchers.like({
          sku: 'test_sku',
          stock: 10,
        }),
        headers: {},
      },
      willRespondWith: {
        status: 200,
        body: '',
      },
    };
  }
}
