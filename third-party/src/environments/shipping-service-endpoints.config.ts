import * as dotenv from 'dotenv';

import { ShippingServiceEndpointsInterface } from '../interfaces';

import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();
const env: ProcessEnv = process.env;

export const shippingServiceEndpointsConfig: ShippingServiceEndpointsInterface = {
  createRule: 
  `${env.MICRO_URL_SHIPPING_INTERNAL}/api/business/:businessId/integration-subscriptions/:subscriptionId/rule`,
  getRules: 
  `${env.MICRO_URL_SHIPPING_INTERNAL}/api/business/:businessId/integration-subscriptions/:subscriptionId/rules`,
  getShippingSubscription: 
  `${env.MICRO_URL_SHIPPING_INTERNAL}/api/business/:businessId/subscription/:integrationName`,
  rule: 
  `${env.MICRO_URL_SHIPPING_INTERNAL}/api/business/:businessId/integration-subscriptions/:subscriptionId/rule/:ruleId`,
};
