/* eslint-disable */
import { ArtilleryTest as artillery } from '@pe/artillery-kit'
import { BUSINESS_PRODUCTS } from '../constants'

function defineVariables(context, _events, done) {
  context.vars.industryName = BUSINESS_PRODUCTS.industryName;
  context.vars.slug = BUSINESS_PRODUCTS.slug;
  context.vars.code = BUSINESS_APPS.code;

  return done();
}

export default {
  auth: artillery.helper.auth,
  defineVariables,
};
