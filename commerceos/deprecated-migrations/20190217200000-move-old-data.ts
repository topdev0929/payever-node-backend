const businessesOld: string = 'businessdashboardapps';
const businessesNew: string = 'businesses';
const usersOld: string = 'userdashboardapps';
const usersNew: string = 'users';

export async function up(db: any): Promise<void> {
  const businesses: any[] = await await db._find(businessesOld, {});

  for (const business of businesses) {
    const existingBusiness: Array<{}> = await db._find(businessesNew, {
      _id: business.businessUuid,
    });

    if (!existingBusiness.length) {
      await db.insert(businessesNew, {
        _id: business.businessUuid,
        installedApps: business.installedApps,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        __v: 0,
      });
    }
  }

  const users: any[] = await await db._find(usersOld, {});

  for (const user of users) {
    const existingUser: Array<{}> = await db._find(usersNew, {
      _id: user.userId,
    });

    if (!existingUser.length) {
      await db.insert(usersNew, {
        _id: user.userId,
        installedApps: user.installedApps,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        __v: 0,
      });
    }
  }
}
