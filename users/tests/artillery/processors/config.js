const artillery = require('@pe/artillery-kit').ArtilleryTest;
const constants = require('../constants');


function defineVariables(context, events, done) {
    const firstName = artillery.helper.faker.name.firstName();
    const lastName = artillery.helper.faker.name.lastName();
    const email = firstName + '.' + lastName + '@payever.net';
    context.vars.type = constants.LEGAL_DOCUMENTS.type;
    context.vars.userId = constants.USER.userId;
    context.vars.businessId = constants.USER.businessId;
    context.vars.businessSlug = constants.SLUG.businessSlug;
    context.vars.content = artillery.helper.faker.random.alpha();
    context.vars.businessName = artillery.helper.faker.random.alpha({ count: 15, upcase: true });
    context.vars.email = email;
    context.vars.position = constants.EMPLOYEE.position;
    context.vars.status = constants.EMPLOYEE.status;
    context.vars.page = constants.EMPLOYEE.page;
    context.vars.limit = constants.EMPLOYEE.limit;
    context.vars.positionFolder = artillery.helper.faker.datatype.number(10);
    context.vars.nameFolder = artillery.helper.faker.datatype.string(10);
    context.vars.domain = constants.TRUSTED_DOMAIN.domain;
    context.vars.confirmEmployee = true;
    context.vars.acls = [
        {
            microservice: "statistics",
            create: false,
            read: false,
            update: false,
            delete: false
        }
    ];
    context.vars.groupName = artillery.helper.faker.datatype.string(10);
    context.vars.first_name = artillery.helper.faker.name.firstName(); 
    context.vars.last_name = artillery.helper.faker.name.lastName();
    context.vars.employees = [artillery.helper.faker.datatype.uuid()];
    return done();
}

module.exports = {
    auth: artillery.helper.auth,
    authAdmin: artillery.helper.authAdmin,
    defineVariables,
    enableBusiness: artillery.helper.enableBusiness,
};
