import { thirdPartiesFixture } from '../fixtures/third-parties.fixture';

const thirdPartiesCollection: string = 'thirdparties';

async function up(db) {
  const fixture = thirdPartiesFixture.find(m => m.name === 'amazon');

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
              _id : '5087a497-3c62-4e81-938d-4972da0e8643',
            },
            {
              description : '',
              name : 'disconnect',
              url : '/auth/:authorizationId',
              method : 'DELETE',
              _id : 'd5056ea3-c566-49ae-855f-4f7f75047be8',
            },
            {
              description : '',
              name : 'create-product',
              url : '/action/create-product/:authorizationId',
              method : 'POST',
              _id : '04b304ff-332b-4fe4-a78e-466b182ea5a3',
            },
            {
              description : '',
              name : 'update-product',
              url : '/action/update-product/:authorizationId',
              method : 'PATCH',
              _id : '85e9dd04-b758-4bd8-a2f8-1c1faf22b544',
            },
            {
              description : '',
              name : 'remove-product',
              url : '/action/remove-product/:authorizationId',
              method : 'DELETE',
              _id : '10f5c765-d8a2-48ed-aac4-491214d0012b',
            },
            {
              description : '',
              name : 'add-inventory',
              url : '/action/add-inventory/:authorizationId',
              method : 'PATCH',
              _id : 'cb998b78-9559-407f-94e1-643a7799a25c',
            },
            {
              description : '',
              name : 'subtract-inventory',
              url : '/action/subtract-inventory/:authorizationId',
              method : 'PATCH',
              _id : '56a936ce-c69f-4d82-8a93-179ef0ba7734',
            },
            {
              description : '',
              name : 'set-inventory',
              url : '/action/set-inventory/:authorizationId',
              method : 'PATCH',
              _id : '9c509bce-119d-4847-83c7-c50fecbf0433',
            },
            {
              description : '',
              name : 'sync-inventory',
              url : '/action/sync-inventory/:authorizationId',
              method : 'POST',
              _id : '1d6b33b5-fcf5-4663-af45-c4bc02fbbaba',
            },
            {
              description : '',
              name : 'sync-products',
              url : '/action/sync-products/:authorizationId',
              method : 'POST',
              _id : 'fc3e05b7-4617-43bf-aa8d-7ed55beaa418',
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
