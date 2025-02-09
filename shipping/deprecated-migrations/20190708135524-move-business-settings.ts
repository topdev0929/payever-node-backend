import { MongoClient} from 'mongodb';
import { v4 as uuidV4 } from 'uuid';
// custom integration
const customIntegrationId = '006a70b6-a178-11e9-ae52-332822bea546';
// collectinons
const businessCollection = 'businesses';
const integrationSubscriptionCollection = 'integrationsubscriptions';
const integrationRulesCollection = 'integrationrules';
// types
const freeOverTypeId = '71e689f2-a185-11e9-a252-1fc0734f1106';
const flatRateTypeId = '77d91096-a185-11e9-94ee-bf86876c7abc';
const byWeightTypeId = '7c09c7aa-a185-11e9-a591-1bb97906562e';
const byOrderTotalTypeId = '80bccd7e-a185-11e9-aa91-7b88b8847df5';

async function up(db) {

    const client = new MongoClient(db.connectionString);
    await client.connect();
    const connectDB = await client.db();
    try {
      await db.createCollection(integrationRulesCollection);
    } catch (e) { }
    const businessMap = {};
    await new Promise((rootResolve: (value?: unknown | Promise<unknown>) => void | Promise<void>, rootReject:(reason?: unknown | Promise<unknown>) => void| Promise<void>) => {
      connectDB.collection(businessCollection).find()
      .stream()
      .on('data', (doc: any) => {
        businessMap[doc._id] = {business: doc, integrationRules : []};

        if (!doc.settings) {
          return;
        }
        // freeOver
        if ( doc.settings.freeShipping && doc.settings.freeShipping.installed ) {
          businessMap[doc._id].integrationRules.push({
            _id: uuidV4(),
            type: freeOverTypeId,
            isActive: doc.settings.freeShipping.isActive,
            freeOver: doc.settings.freeShipping.freeOver,
          });
        }
        if ( doc.settings.flatRateShipping && doc.settings.flatRateShipping.installed ) {
          businessMap[doc._id].integrationRules.push({
            _id: uuidV4(),
            type: flatRateTypeId,
            isActive: doc.settings.flatRateShipping.isActive,
            rate: doc.settings.flatRateShipping.rate,
            flatRateType: doc.settings.flatRateShipping.flatRateType,
          });
        }
        if ( doc.settings.byWeightShipping && doc.settings.byWeightShipping.installed ) {
          businessMap[doc._id].integrationRules.push({
            _id: uuidV4(),
            type: byWeightTypeId,
            isActive: doc.settings.byWeightShipping.isActive,
            weightRanges: doc.settings.byWeightShipping.weightRanges,
          });
        }
        if ( doc.settings.byOrderTotalsShipping && doc.settings.byOrderTotalsShipping.installed ) {
          businessMap[doc._id].integrationRules.push({
            _id: uuidV4(),
            type: byOrderTotalTypeId,
            isActive: doc.settings.byOrderTotalsShipping.isActive,
            rateRanges: doc.settings.byOrderTotalsShipping.rateRanges,
          });
        }

      })
      .on('error', (err) => {
        console.log(err);
        rootReject(err);
      })
      .on('end', () => {
        const promises =  Object.keys(businessMap).map( async businessId => {
          return new Promise(async (resolve: (value?: unknown | Promise<unknown>) => void | Promise<void>, reject: (reason?: unknown | Promise<unknown>) => void| Promise<void>) => {
              const business = businessMap[businessId].business;
              const integrationSubscriptionRules = businessMap[businessId].integrationRules;
              let insertedSubscriptionRules;
              if (integrationSubscriptionRules.length > 0) {
                insertedSubscriptionRules = await connectDB
                .collection(integrationRulesCollection)
                .bulkWrite(integrationSubscriptionRules.map(v => ({ insertOne: { document: v } })));
                // tslint:disable-next-line: no-console
                console.log('rules creating for business:', business._id);
              }
              const customIntegrationSubscription = await connectDB.collection(integrationSubscriptionCollection)
              .insertOne({
                _id: uuidV4(),
                installed : business.shippingAppInstalled,
                isActive : business.shippingAppInstalled,
                integration : customIntegrationId,
                enabled : business.shippingAppInstalled,
                rules: (insertedSubscriptionRules && insertedSubscriptionRules.insertedIds) ? Object.keys(insertedSubscriptionRules.insertedIds).map((k) => insertedSubscriptionRules.insertedIds[k]) : [],
                createdAt : new Date('2019-03-08T11:42:58.436+0000'),
                updatedAt : new Date('2019-03-18T10:38:19.122+0000'),
                __v : 0,
              });

              await connectDB.collection(businessCollection)
              .findOneAndUpdate(
              {_id: businessId},
              {$set: {integrationSubscriptions: [customIntegrationSubscription.insertedId, ...business.integrationSubscriptions]},
              $unset : { settings: 1}},
              {upsert: true});
              resolve();
          });
        });
        Promise.all(promises).then(_ => {
          rootResolve();
        });
      });

    });
    await client.close();
    return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
