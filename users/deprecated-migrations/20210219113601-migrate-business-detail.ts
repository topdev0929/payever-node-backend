const businessesColletion: string = 'businesses';
const businessDetailsColletion: string = 'businessdetails';

export async function up(db: any): Promise<void> {
  console.log('Fetch all businesses');
  const businesses: any[] = await db._find(businessesColletion);
  console.log('Businesses count', businesses.length);

  for (const business of businesses) {
    const businessDetail: any = await db._run(
      'insert',
      businessDetailsColletion,
      {
        _id: business._id,
        bankAccount: business.bankAccount,
        companyAddress: business.companyAddress,
        companyDetails: business.companyDetails,
        contactDetails: business.contactDetails,
      },
    );

    await db._run(
      'update',
      businessesColletion,
      {
        query: { _id: business._id },
        update: {
          $set: {
            businessDetail: business._id,
          },
          $unset: {
            bankAccount: '',
            companyAddress: '',
            companyDetails: '',
            contactDetails: '',
          },
        },
      },
    );
  }

  return null;
}

export function down(): void {
  return null;
}
