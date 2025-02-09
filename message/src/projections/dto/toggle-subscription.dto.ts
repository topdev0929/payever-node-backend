/* eslint-disable max-len */
/**
 * @ref https://gitlab.devpayever.com/nodejs-backend/commerceos/blob/be03f4cdeb1fdd7aa470c4cdef75008dc59b927f/src/apps/producers/apps-events.producer.ts#L19
 */
export interface ToggleApplicationSubscriptionDto {
  /**
   * @description commerceos dashboard app
   * @example `connect`, `settings`, `invoice`, `message`
   */
  code: string;
  businessId: string;
}
