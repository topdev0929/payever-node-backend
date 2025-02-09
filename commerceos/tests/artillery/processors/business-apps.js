/* eslint-disable */
import { ArtilleryTest as artillery } from '@pe/artillery-kit'
import { BUSINESS_APPS } from '../constants'

function defineVariables(context, _events, done) {
  context.vars.businessId = BUSINESS_APPS.businessId;
  context.vars.microUuid = BUSINESS_APPS.microUuid;
  context.vars.code = BUSINESS_APPS.code;
  // events is unused
  return done();
}

export default {
  auth: artillery.helper.auth,
  defineVariables,
};
