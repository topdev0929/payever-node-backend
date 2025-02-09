import { getError } from '../constants';
import { ErrorName } from '../enums';
import { CustomErrorInterface } from '../interfaces';

export class CustomError extends Error implements CustomErrorInterface {

  public statusCode: number;

  constructor(errorName: ErrorName, params?: { [key: string]: string }) {
    super();
    const error: CustomErrorInterface = getError(errorName);
    if (error) {
      this.message = this.getMessage(error.message, params);
      this.statusCode = error.statusCode;
    }
  }

  public getError(): CustomErrorInterface {
    return { message: this.message, statusCode: this.statusCode };
  }

  private getMessage(message: string, params?: { [key: string]: string }): string {
    let res: string = message;
    if (!params) {
      return res;
    }
    const keys: string[] = Object.keys(params);
    for (const key of keys) {
      res = res.replace(`{${key}}`, params[key]);
    }

    return res;
  }
}
