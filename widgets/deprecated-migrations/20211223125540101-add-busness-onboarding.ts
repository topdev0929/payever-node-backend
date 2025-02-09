const businessCollection: string = 'businesses';
const onboardingCollection: string = 'onboardingappinstallations';

async function upwards(db: any): Promise<void> {
  const businesses: Array<{ _id: string }> = await db._find(businessCollection, { });
  await db.insert(
    onboardingCollection,
    businesses.map((business: any) => ( { 
      businessId: business._id,
      businessInstallation: true,
      widgetInstallation: true,
    } )),
  );
}

async function downwards(db: any): Promise<any> {
  return null;
}

module.exports.up = upwards;
module.exports.down = downwards;

