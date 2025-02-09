const artillery = require("@pe/artillery-kit").ArtilleryTest;
const constants = require("../constants");

function defineVariables(context, events, done) {
  context.vars.userId = constants.USER.userId;
  context.vars.businessId = constants.USER.businessId;
  context.vars.sku = constants.SKU.sku;
  context.vars.productId = constants.PRODUCT.productId;
  context.vars.inventoryId = constants.INVENTORY.inventoryId;
  context.vars.inventoryLocationId = constants.INVENTORY.inventoryLocationId;
  return done();
}

module.exports = {
  auth: artillery.helper.auth,
  defineVariables: defineVariables,
};
