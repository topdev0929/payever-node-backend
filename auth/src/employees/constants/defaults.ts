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
    create: true,
    delete: true,
    microservice: 'commerceos',
    read: true,
    update: true,
  },
];

export const DEAFULT_EMPLOYEE_TOKEN_EXPIRY_HOURS: number = 24;
