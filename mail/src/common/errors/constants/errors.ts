import { ErrorName } from '../enums';
import { CustomErrorInterface } from '../interfaces';

export const errorType: { [key: string ]: CustomErrorInterface } = { };
errorType[ErrorName.ItemNotFound] = { 
  message: `Required {itemName} with id '{id}' was not found`, 
  statusCode: 404, 
};
errorType[ErrorName.IdsNotValid] = { 
  message: 'Provided id(s) not valid', 
  statusCode: 400,
};
errorType[ErrorName.ItemNotInBusiness] = { 
  message: `Required {itemName} with id '{itemId}' was not found in business with id '{businessId}'`, 
  statusCode: 400,
};
errorType[ErrorName.ContactsListEmpty] = { 
  message: `Contacts list is empty, impossible to send email'`, 
  statusCode: 400,
};
errorType[ErrorName.BusinessNotFound] = {
  message: `Business not found.`,
  statusCode: 400,
};

export function getError(name: ErrorName): CustomErrorInterface {
  return errorType[name];
}
