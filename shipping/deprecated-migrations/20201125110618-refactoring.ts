import { MongoClient } from 'mongodb';
import { ShippingStatusEnums } from '../src/shipping/enums';

// tslint:disable
const businessesCollection = 'businesses';
const channelSetsCollection = 'channelsets';
const integrationRulesCollection = 'integrationrules';
const integrationSubscriptionsCollection = 'integrationsubscriptions';
const shippingOrdersCollection = 'shippingorders';
const shippingSettingsCollection = 'shippingsettings';
const shippingZonesCollection = 'shippingzones';
const integrationRuleTypesCollection = 'integrationruletypes';

async function up(db) {
  const client: MongoClient = new MongoClient(db.connectionString);
  await client.connect();
  const connectDB = await client.db();

  try {
    await connectDB.collection(integrationRuleTypesCollection)
      .drop();
  } catch(e) {}

  await Promise.all([
    connectDB.collection(businessesCollection)
      .updateMany({}, { $unset: { legacyId: 1, shippingAppInstalled: 1 }}),
    connectDB.collection(channelSetsCollection)
      .updateMany({}, { $rename: { businessId: 'business' }}),
    connectDB.collection(integrationRulesCollection)
      .updateMany({}, { $unset: { name: 1, type: 1, flatRateType: 1 }, $rename: { rate: 'flatRate' }}),
    connectDB.collection(integrationSubscriptionsCollection)
      .updateMany({}, { $unset: { isActive: 1 }}),
    connectDB.collection(shippingSettingsCollection)
      .updateMany({}, { $rename: { businessId: 'business' }}),
    connectDB.collection(shippingZonesCollection)
      .updateMany({}, { $rename: { deliveryTime: 'deliveryTimeDays' }}),
    connectDB.collection(shippingOrdersCollection)
      .updateMany(
        { }, 
        {
          $rename: {
            businessId: 'business',
            items: 'shippingItems',
            method: 'shippingMethod',
            shipTo: 'shippingAddress',
            shipmentDate: 'shippedAt',
            transactionDate: 'processedAt',
          },
        },
      ),
      connectDB.collection(shippingOrdersCollection)
        .updateMany(
          {
            isProcessed: 1
          },
          {
            $set: {
              status: ShippingStatusEnums.Processed
            }
          }
        ),
      connectDB.collection(shippingOrdersCollection)
        .updateMany(
          {
            isCompleted: 1
          },
          {
            $set: {
              status: ShippingStatusEnums.Shipped
            }
          }
        ),
      connectDB.collection(shippingOrdersCollection)
        .updateMany(
          {
            isCancelled: 1
          },
          {
            $set: {
              status: ShippingStatusEnums.Cancelled
            }
          }
        ),
  ]);

  await connectDB.collection(shippingOrdersCollection)
    .updateMany({}, {
      $unset: { isCancelled: 1, isCompleted: 1, isMethodSelected: 1, isProcessed: 1, methods: 1 },
    });

  await client.close();

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
