import { AclInterface } from '@pe/nest-kit';

export const defaultCommercesOsGroup: AclInterface = {
  create: true,
  delete: true,
  microservice: 'commerceos',
  read: true,
  update: true,
};

export const defaultAcls: AclInterface[] = [
  {
    microservice: 'commerceos',
    read: true,
  },
];
