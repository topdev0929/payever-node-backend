// tslint:disable: object-literal-sort-keys
import { plainToClass } from 'class-transformer';
import { AclInterface } from '@pe/nest-kit';
import {
  BulkCreateEmployeeRowDto,
  BulkCreateEmployeesRowDto,
  CreateEmployeeDto,
  CreateEmployeeForBusinessDto,
} from '../dto';
import { AddressInterface } from '../interfaces/address.interface';
import { Positions } from '../enum/positions.enum';
import * as qs from 'qs';

export function bulkCreateEmployeeItemToCreateEmployeeDtoTransformer(
  item: BulkCreateEmployeeRowDto,
): CreateEmployeeDto {

  const address: AddressInterface = {
    city: item.City,
    state: item.State,
    country: item.Country,
    zipCode: item['Zip Code'],
    street: item.Street,
  };

  const plain: CreateEmployeeDto = {
    userId: item['User Id'],
    email: item.Email,
    firstName: item['First Name'],
    lastName: item['Last Name'],
    position: item.Position || Positions.others,
    companyName: item['Company Name'],
    phoneNumber: item['Phone Number'],
    address: address,
    status: item.Status,
    logo: item.Logo,
    fullValidation: item.FullValidation,
    groups: item.Groups?.split(';'),
    acls: item.Acls?.split(';').filter((aclString: string) => aclString).map(parseAcls),
    confirmEmployee: item['Confirm Employee'],
  };

  return plainToClass(CreateEmployeeDto, plain);
}

export function bulkCreateEmployeesForBusinessesToCreateEmployeeDtoTransformer(
  item: BulkCreateEmployeesRowDto,
): CreateEmployeeForBusinessDto {

  const address: AddressInterface = {
    city: item.City,
    state: item.State,
    country: item.Country,
    zipCode: item['Zip Code'],
    street: item.Street,
  };

  const plain: CreateEmployeeForBusinessDto = {
    businessId: item['Business Id'],
    userId: item['User Id'],
    email: item.Email,
    firstName: item['First Name'],
    lastName: item['Last Name'],
    position: item.Position || Positions.others,
    companyName: item['Company Name'],
    phoneNumber: item['Phone Number'],
    address: address,
    status: item.Status,
    logo: item.Logo,
    fullValidation: item.FullValidation,
    groups: item.Groups?.split(';'),
    acls: item.Acls?.split(';').map(parseAcls),
    confirmEmployee: item['Confirm Employee'],
  };

  return plainToClass(CreateEmployeeForBusinessDto, plain);
}

function parseAcls(aclString: string): AclInterface {
  const parsedAcl: any = qs.parse(aclString.split('?').pop());
  const allowedAcls: string[] = ['create', 'read', 'update', 'delete'];

  const acls: AclInterface = {
    microservice: aclString.split('?').shift(),
    create: false,
    read: false,
    update: false,
    delete: false,
  };

  allowedAcls.forEach((acl: string) => {
    acls[acl] = stringToBoolean(parsedAcl[acl]);
  });

  return acls;

  function stringToBoolean(value: string | boolean): boolean {
    return value === 'true' || value === true;
  } 
}
