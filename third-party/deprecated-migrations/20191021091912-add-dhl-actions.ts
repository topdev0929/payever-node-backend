import { thirdPartiesFixture } from '../fixtures/third-parties.fixture';

const thirdPartiesCollection: string = 'thirdparties';

async function up(db) {
  const fixture = thirdPartiesFixture.find(m => m.name === 'dhl');

  db._run(
    'update',
    thirdPartiesCollection,
    {
      query: { _id: fixture._id },
      update: {
        $set: {
          actions: [
            {
              description : '',
              name : 'connect',
              url : '/auth',
              method : 'POST',
              _id : '93a86176-f3e4-11e9-91cb-fbdf5b1307ad',
            },
            {
              description : '',
              name : 'disconnect',
              url : '/auth/:authorizationId',
              method : 'DELETE',
              _id : '8f3f6b16-f3e4-11e9-b158-e731405eba42',
            },
            {
              description : '',
              name : 'get-rates',
              url : '/action/get-rates/:authorizationId',
              method : 'GET',
              _id : '8a7ae128-f3e4-11e9-8220-1b27ea213556',
            },
            {
              description : '',
              name : 'validate-order',
              url : '/action/validate-order/:authorizationId',
              method : 'POST',
              _id : '86a3b930-f3e4-11e9-b3e7-1bfba826f432',
            },
            {
              description : '',
              name : 'create-order',
              url : '/action/create-order/:authorizationId',
              method : 'POST',
              _id : '8165b2f2-f3e4-11e9-afe4-2f00fd4f1668',
            },
            {
              description : '',
              name : 'delete-order',
              url : '/action/delete-order/:authorizationId',
              method : 'POST',
              _id : '7dd60f88-f3e4-11e9-8e53-378a6d2422d8',
            },
            {
              description : '',
              name : 'get-label',
              url : '/action/get-label/:authorizationId',
              method : 'POST',
              _id : 'd72d3368-f3e9-11e9-ad17-23780255d078',
            },
            {
              description : '',
              name : 'track-shipment',
              url : '/action/track-shipment/:authorizationId',
              method : 'POST',
              _id : '0dfbab42-f3e8-11e9-97ae-3bfaabe2f564',
            },
          ],
        },
      },
    },
  );
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
