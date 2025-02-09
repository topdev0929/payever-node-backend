import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
@ValidatorConstraint({
  async: false,
  name: 'stringOrBuffer',
})
export class IsStringOrBuffer implements ValidatorConstraintInterface {
  public defaultMessage(args: ValidationArguments): string {
    return `Content type is invalid. Should be string or buffer`;
  }
  public validate(value: any): boolean {
    let result = false;
    if (typeof value === 'string') {
      result = true;
    }
    if (value?.type === 'Buffer' && Array.isArray(value?.data)) {
      result = true;
    }

    return result;
  }
}
