const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');

function defineVariablesCampaign(context, events, done) {
  context.vars.businessId = constants.CAMPAIGN.businessId;
  return done();
}

function defineVariablesBusTest(context, events, done) {
  context.vars.businessId = constants.BUS_TEST.businessId;
  context.vars.amount = artillery.helper.faker.finance.amount(1000, 10000, 0);
  context.vars.date = artillery.helper.faker.date.future();
  context.vars.name = artillery.helper.faker.random.alpha({ count: 16 });
  context.vars.currency = constants.BUS_TEST.currency;
  context.vars.channelSetId = constants.BUS_TEST.channelSetId;
  context.vars.type = constants.BUS_TEST.type;
  context.vars.campaignId = constants.BUS_TEST.campaignId;
  context.vars.contacts = constants.BUS_TEST.contacts;

  return done();
}
function defineVariablesUser(context, events, done) {
  return done()
}

function defineVariablesAdmin(context, events, done) {
  context.vars.widgetType = Date.now().toString()
  return done()
}

function setWidgetIdAdmin(requestParams, response, context, ee, next) {
  const body = JSON.parse(response.body)
  if (body) {
    context.vars.widgetId = body._id;
    context.vars.widgetType = body.type
  }

  return next()
}

function setPushNotificationId(requestParams, response, context, ee, next) {
  const body = JSON.parse(response.body)
  if (body) {
    context.vars.pushNotificationId = body._id
  }

  return next()
}

function defineVariablesWidgetInvoice(context, events, done) {
  return done()
}
// Start Widget Functions

function defineVariablesWidget(context, events, done) {
  context.vars.widgetTitle = artillery.helper.faker.random.alpha({ count: 16 });
  context.vars.businessId = constants.WIDGET.businessId;
  context.vars.widgetType = Date.now().toString()
  context.vars.widgetIcon = constants.WIDGET.widgetIcon;
  context.vars.channelSetId = constants.WIDGET.channelSetId;

  return done()
}

function defineWidgetVariables(context, events, done) {
  context.vars.widgetTitle = artillery.helper.faker.random.alpha({ count: 16 });
  context.vars.widgetType = constants.WIDGET.widgetType;
  context.vars.widgetIcon = constants.WIDGET.widgetIcon;

  return done();
}

function defineBusinessWidgetVariables(context, events, done) {
  context.vars.widgetTitle = artillery.helper.faker.random.alpha({ count: 16 });
  context.vars.widgetType = constants.WIDGET.widgetType;

  return done();
}

function defineProductsAppVariables(context, events, done) {
  context.vars.channelSetId = constants.WIDGET.channelSetId;

  return done();
}

function defineTransactionsAppVariables(context, events, done) {
  context.vars.channelSetId = constants.WIDGET.channelSetId;

  return done();
}

function defineBusinessId(requestParams, response, context, ee, next) {
  const body = artillery.helper.getResponseBody(response);
  const business = (body || []).find(b => b.active);

  if (business) {
    context.vars.businessId = business._id;
  }

  return next();
}

function defineWidgetId(requestParams, response, context, ee, next) {
  const body = JSON.parse(response.body);
  if (body) {
    context.vars.widgetId = body._id;
  }

  return next();
}

// End Widget Functions


function afterEnableEbusiness(requestParams, response, context, ee, next) {
  const body = JSON.parse(response.body)
  context.vars.accessToken = body.accessToken;

  return next()
}


module.exports = {
  auth: artillery.helper.auth,
  afterEnableEbusiness,
  defineVariablesCampaign,
  defineVariablesBusTest,
  defineVariablesUser,

  defineVariablesAdmin,
  setWidgetIdAdmin,
  setPushNotificationId,

  defineVariablesWidgetInvoice,

  // Start Widget Functions
  defineVariablesWidget,
  defineWidgetId,
  defineBusinessId,
  defineTransactionsAppVariables,
  defineProductsAppVariables,
  defineWidgetVariables,
  defineBusinessWidgetVariables
};
