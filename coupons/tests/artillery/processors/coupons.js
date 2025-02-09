const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariables(context, events, done) {
  context.vars.userId = constants.USER.userId;
  context.vars.businessId = constants.USER.businessId;
  context.vars.channelsetId = constants.COUPON.channelsetId;
  context.vars.couponCode = constants.COUPON.couponCode;
  context.vars.code = artillery.helper.faker.random.alpha(10);
  context.vars.channelsetIds = [constants.COUPON.channelsetId];
  context.vars.description = artillery.helper.faker.datatype.string();
  context.vars.limits = {
    limitOneUsePerCustomer: artillery.helper.faker.datatype.boolean(),
    limitUsage: artillery.helper.faker.datatype.boolean(),
    limitUsageAmount: artillery.helper.faker.datatype.number(),
  };
  context.vars.name = artillery.helper.faker.datatype.string();
  context.vars.startDate = artillery.helper.faker.datatype.datetime();
  context.vars.status = constants.COUPON.status;
  context.vars.type = {
    appliesTo: constants.COUPON.typeApplied,
    appliesToCategories: [],
    appliesToProducts: [],
    discountValue: artillery.helper.faker.datatype.number({
      min: 1,
      max: 99
    }),
    minimumRequirements: constants.COUPON.minimumRequirements,
    minimumRequirementsPurchaseAmount: artillery.helper.faker.datatype.number(),
    minimumRequirementsQuantityOfItems: artillery.helper.faker.datatype.number(),
    type: constants.COUPON.type,
  };
  context.vars.customerEligibility = constants.COUPON.customerEligibility;
  context.vars.cart = [{
    name: artillery.helper.faker.random.alpha(10),
    price: artillery.helper.faker.commerce.price(),
    quantity: artillery.helper.faker.datatype.number(),
    identifier: artillery.helper.faker.random.alpha(10),
  }];
  context.vars.customerEmail = constants.COUPON.customerEmail;
  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  authAdmin: artillery.helper.authAdmin,
  enableBusiness: artillery.helper.enableBusiness,
  defineVariables,
};
