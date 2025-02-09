import { onboardings } from '../fixtures/onboardings.fixture';
import { OnboardingDto, ActionDto } from '../src/onboarding/dto';
import { MongoClient, Db } from 'mongodb';
import {
  PaymentDefaultAppsSantanderFixture,
} from '../fixtures/payments-default-apps-fixture';
import { environment } from '../src/environments';
import { RegisterStep, OnboardingPaymentNameEnum } from '../src/onboarding/enums';

const onboardingCollection: string = 'onboardings';

async function up(db: any): Promise<any> {
  const client: MongoClient = new MongoClient(db.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const connectDB: Db = await client.db();

  const paymentOnboarding: OnboardingDto =
    onboardings.find( (item: OnboardingDto) => item.name === OnboardingPaymentNameEnum.santander);

  if (paymentOnboarding) {
    let orderId: number = 0;
    if (paymentOnboarding.afterRegistration) {
      paymentOnboarding.afterRegistration.forEach((item: ActionDto) => {
        orderId = Math.max(item.orderId, orderId);
      });
    }

    const fixture: any[] = PaymentDefaultAppsSantanderFixture;

    const tokenStep: ActionDto = {
      method: 'PATCH',
      name: `refresh-token`,
      orderId: ++orderId,
      payload: { },
      priority: 1,
      registerSteps: [RegisterStep.business],
      url: `${environment.microUrlAuth}/api/business/:businessId/enable`,
    };

    let installIntegrations: ActionDto[] = fixture.map((item: any) => {
      return {
        method: 'PATCH',
        name: `install-${item.integration}`,
        orderId: ++orderId,
        payload: { },
        priority: 2,
        registerSteps: [RegisterStep.business],
        url: `${environment.microUrlConnect}/business/:businessId/integration/${item.integration}/install`,

        integration: {
          country: item.country,
          device: item.device,
          method: item.method,
          name: item.name,
        },
      };
    } );

    installIntegrations = [
      tokenStep,
      ...installIntegrations,
    ];

    paymentOnboarding.afterRegistration
      ? paymentOnboarding.afterRegistration.push(...installIntegrations)
      : paymentOnboarding.afterRegistration = installIntegrations;

    await connectDB.collection(onboardingCollection).findOneAndUpdate(
      {
        _id: paymentOnboarding._id,
      },
      {
        $set: paymentOnboarding,
      },
      {
        upsert: true,
      },
    );
  }

  await client.close();
}

function down(): any {
  return null;
}

module.exports.up = up;
module.exports.down = down;
