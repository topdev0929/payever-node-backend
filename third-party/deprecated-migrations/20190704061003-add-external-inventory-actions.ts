import { MongoClient } from 'mongodb';

const thirdpartiesCollection = 'thirdparties';

async function up(db) {

    const client = new MongoClient(db.connectionString);
    await client.connect();
    const connectDB = await client.db();
    connectDB.collection(thirdpartiesCollection)
    .findOneAndUpdate(
      {name: 'external-inventory', category: 'products'},
      {$set: {
        actions : [
          {
              description : '',
              name : 'connect',
              url : '/auth',
              method : 'POST',
              _id : '7c113ac7-e88c-4ffc-85ee-f2eb3de024e9',
              createdAt : '2019-05-03T10:53:04.120+0000',
              updatedAt : '2019-05-03T10:53:05.113+0000',
              __v : 0,
          },
          {
              description : '',
              name : 'disconnect',
              url : '/auth/:authorizationId',
              method : 'DELETE',
              _id : '193238a2-7713-4268-8746-2e9bb7951e44',
              createdAt : '2019-05-03T11:04:11.201+0000',
              updatedAt : '2019-05-03T11:04:11.351+0000',
              __v : 0,
          },
          {
              description : '',
              name : 'add-inventory',
              url : '/action/add-inventory/:authorizationId',
              method : 'PATCH',
              _id : 'de5cf09d-57ef-42b9-ba65-9b8ef6ddc265',
              createdAt : '2019-05-06T08:16:40.898+0000',
              updatedAt : '2019-05-06T08:16:41.053+0000',
              __v : 0,
          },
          {
              description : '',
              name : 'subtract-inventory',
              url : '/action/subtract-inventory/:authorizationId',
              method : 'PATCH',
              _id : 'de5cf09d-57ef-120f-ba65-9b8ef6ddc265',
              createdAt : '2019-05-06T08:16:40.898+0000',
              updatedAt : '2019-05-06T08:16:41.053+0000',
              __v : 0,
          },
          {
              description : '',
              name : 'set-inventory',
              url : '/action/set-inventory/:authorizationId',
              method : 'PATCH',
              _id : 'de5cf09d-57ef-120f-00f2-9b8ef6ddc265',
              createdAt : '2019-05-06T08:16:40.898+0000',
              updatedAt : '2019-05-06T08:16:41.053+0000',
              __v : 0,
          },

      ] }},
      {upsert: true});
    await client.close();
    return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
