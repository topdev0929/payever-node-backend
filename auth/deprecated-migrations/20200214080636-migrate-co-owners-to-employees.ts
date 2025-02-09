import { User } from '../src/users/interfaces';
import { isMerchantRoleInterface } from '@pe/nest-kit';
import { Positions, Status } from '../src/employees/enum';

export async function up(db: any): Promise<void> {
  const users: User[] = await db._find('users', { });

  const businesses: any = await reformatBusinesses(users);

  clearBusinessesWithOneOwner(businesses);

  for (const businessId of Object.keys(businesses)) {
    const businessOwners: User[] = await getCoOwners(db, businessId, businesses);

    await updateCoOwners(db, businessId, businessOwners);
  }
}

const reformatBusinesses: (users: User[]) => Promise<any> = async (users: User[]): Promise<any> => {
  const businesses: any = { };

  for (const user of users) {
    for (const role of user.roles) {
      if (isMerchantRoleInterface(role)) {
        for (const permission of role.permissions) {
          if (!businesses[permission.businessId]) {
            businesses[permission.businessId] = [];
          }
          businesses[permission.businessId].push(user._id);
        }
      }
    }
  }

  return businesses;
};

const updateCoOwners: (db: any, businessId: string, businessOwners: User[]) => Promise<void>
  = async (db: any, businessId: string, businessOwners: User[]): Promise<void> => {
  for (const coOwner of businessOwners) {
    await db._run('update', 'users', {
      query: { _id: coOwner._id},
      update: { $addToSet: { positions: {
        businessId,
        positionType: Positions.admin,
        status: Status.active,
      }}},
    });
  }
};

const getCoOwners: (db: any, businessId: string, businesses: any) => Promise<User[]> =
  async (db: any, businessId: string, businesses: any): Promise<User[]> => {
  const businessOwners: User[] = await db._find('users', {
    _id: { $in: businesses[businessId]},
    positions: { $not: { $elemMatch: { businessId}}},
  });

  businessOwners.sort((a: User, b: User) => (a.createdAt > b.createdAt) ? 1 : -1);
  businessOwners.shift();

  return businessOwners;
};

const clearBusinessesWithOneOwner: (businesses: any) => void = (businesses: any): void => {
  for (const businessId of Object.keys(businesses)) {
    if (businesses[businessId].length === 1) {
      delete businesses[businessId];
    }
  }
};

export async function down(): Promise<void> { }
