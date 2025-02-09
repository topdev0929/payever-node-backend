const oldCheckoutCollection = 'checkoutmodels';
const oldPosCollection = 'posmodels';

const businessCollection = 'businesses';
const checkoutCollection = 'checkouts';
const terminalCollection = 'terminals';
const channelSetCollection = 'channelsets';

const posChannelUuid = '2491af13-c7d9-45e3-9758-9bb59c467535';
const DEFAULT_LOCALE: string = 'en';

async function up(db) {
  await migrateCheckouts(db);
  await migrateTerminals(db);

  return null;
}

function down() {
  return null;
}

async function migrateCheckouts(db) {
  const oldCheckouts = await db._find(oldCheckoutCollection);

  for (const oldCheckout of oldCheckouts) {
    const businesses: Array<{}> = await db._find(businessCollection, { _id: oldCheckout.businessUuid });
    let business;

    if (!businesses.length) {
      business = {
        _id: oldCheckout.businessUuid,
        terminals: [],
        checkouts: [],
        channelSets: [],
        subscriptions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      };
    } else {
      business = businesses[0];
      business.terminals = business.terminals ? business.terminals : [];
      business.checkouts = business.checkouts ? business.checkouts : [];
      business.channelSets = business.channelSets ? business.channelSets : [];
      business.subscriptions = business.channsubscriptionselSets ? business.subscriptions : [];
      business.createdAt = business.createdAt ? business.createdAt : new Date();
      business.updatedAt = business.updatedAt ? business.updatedAt : new Date();
      business.__v = business.__v ? business.__v : 0;
    }

    const checkouts = [];
    for (const checkout of oldCheckout.checkoutList) {
      const existingCheckouts: Array<{}> = await db._find(checkoutCollection, { _id: checkout.uuid });

      if (!existingCheckouts.length) {
        await db.insert(checkoutCollection, { _id: checkout.uuid });
        checkouts.push(checkout.uuid);
      }
    }

    business.checkouts = checkouts;

    if (!businesses.length) {
      await db.insert(businessCollection, business);
    } else {
      await db._run(
        'update',
        businessCollection,
        {
          query: { _id: oldCheckout.businessUuid },
          update: { $set: business },
          options: {},
        },
      );
    }
  }
}

async function migrateTerminals(db) {
  const oldPosModels = await db._find(oldPosCollection);

  for (const oldPosModel of oldPosModels) {
    const businesses: Array<{}> = await db._find(businessCollection, { _id: oldPosModel.businessUuid });
    let business;

    if (!businesses.length) {
      business = {
        _id: oldPosModel.businessUuid,
        terminals: [],
        checkouts: [],
        channelSets: [],
        subscriptions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      };
    } else {
      business = businesses[0];
      business.terminals = business.terminals ? business.terminals : [];
      business.checkouts = business.checkouts ? business.checkouts : [];
      business.channelSets = business.channelSets ? business.channelSets : [];
      business.subscriptions = business.channsubscriptionselSets ? business.subscriptions : [];
      business.createdAt = business.createdAt ? business.createdAt : new Date();
      business.updatedAt = business.updatedAt ? business.updatedAt : new Date();
      business.__v = business.__v ? business.__v : 0;
    }

    const terminals = [];
    for (const terminal of oldPosModel.terminals) {
      const existingTerminals: Array<{}> = await db._find(
        terminalCollection,
        {
          name: terminal.name,
          business: oldPosModel.businessUuid,
        },
      );
      let checkout = '';
      let channelSet = '';

      if (!existingTerminals.length) {
        if (terminal.checkoutId) {
          checkout = terminal.checkoutId;

          const existingCheckouts: Array<{}> = await db._find(checkoutCollection, { _id: terminal.checkoutId });
          if (!existingCheckouts.length) {
            await db.insert(checkoutCollection, { _id: terminal.checkoutId });
          }
        }

        if (terminal.channelSetId) {
          channelSet = terminal.channelSetId;

          const existingChannelSets: Array<{}> = await db._find(channelSetCollection, { _id: terminal.channelSetId });
          if (!existingChannelSets.length) {
            await db.insert(
              channelSetCollection,
              {
                _id: terminal.channelSetId,
                channel: posChannelUuid,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            );

            if (business.channelSets && business.channelSets.length) {
              business.channelSets.push(terminal.channelSetId);
            } else {
              business.channelSets = [terminal.channelSetId];
            }
          }
        }

        await db.insert(
          terminalCollection,
          {
            _id: terminal._id,
            business: oldPosModel.businessUuid,
            channelSet: channelSet,
            checkout: checkout,
            name: terminal.name,
            logo: terminal.logo ? terminal.logo : '',
            currency: terminal.currency ? terminal.currency : '',
            active: terminal.active,
            // default: terminal.default,
            phoneNumber: terminal.phoneNumber ? terminal.phoneNumber : '',
            message: terminal.message ? terminal.message : '',
            locales: terminal.locales ? terminal.locales : [DEFAULT_LOCALE],
            defaultLocale: terminal.defaultLocale ? terminal.defaultLocale : DEFAULT_LOCALE,
          },
        );
        terminals.push(terminal._id);
      }
    }

    business.terminals = terminals;

    if (!businesses.length) {
      await db.insert(businessCollection, business);
    } else {
      await db._run(
        'update',
        businessCollection,
        {
          query: { _id: oldPosModel.businessUuid },
          update: { $set: business },
          options: {},
        },
      );
    }
  }
}

module.exports.up = up;
module.exports.down = down;
