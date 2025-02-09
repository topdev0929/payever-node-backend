import { MongoClient, ObjectId } from 'mongodb';
const checkoutsCollection = 'checkouts';

async function up(db) {
  const languages: Array<any> = await db._find('languages', {});

  const client = new MongoClient(db.connectionString);
  await client.connect();

  const checkoutDb = await client.db();

  let counter = 0;
  const total = await checkoutDb.collection(checkoutsCollection).countDocuments();
  console.log(`Processing total ${total} entries...`)

  await checkoutDb.collection(checkoutsCollection)
    .find().forEach(async x => {
      let needUpdate = false;
      const checkoutLanguages = x.settings.languages;
      const addedLanguages = [];

      for (const language of languages) {
        if (!checkoutLanguages || !checkoutLanguages.find(x => x.code === language.code)) {
          needUpdate = true;
          addedLanguages.push({
            active: false,
            isDefault: false,
            code: language.code,
            name: language.name,
          })
        }
      }

      if (needUpdate) {
        checkoutDb.collection(checkoutsCollection).update(
          { _id: x._id },
          { $push: { 'settings.languages': { $each: addedLanguages } } },
        );
      }

      counter++;
      if (counter % 1000 === 0) {
        console.log(`Processed ${counter} of ${total}`);
      }
    })


  await client.close();
  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
