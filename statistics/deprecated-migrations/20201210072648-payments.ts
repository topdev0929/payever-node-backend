import { PaymentFactory } from '../fixtures/factories/payment.factory';

const paymentsCollection = 'payments';

async function up(db) {
  /*const payments = [];

  for (let i = 0; i < 1000; i++) {
    payments.push(PaymentFactory({}));
  }

  await db.insert(paymentsCollection, payments);*/

  return null;
}

function down() {
  return null;
}

module.exports.up = up;
module.exports.down = down;
