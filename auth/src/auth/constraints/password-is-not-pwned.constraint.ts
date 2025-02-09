import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { pwnedPassword } from 'hibp';
import { environment } from '../../environments';

@ValidatorConstraint({ async: true })
class PasswordNotPwned implements ValidatorConstraintInterface {
  public async validate(password: string): Promise<boolean> {
    if (environment.appNamespace === 'test') {
      return true;
    }

    return !(await pwnedPassword(password));
  }

  public defaultMessage(_args: ValidationArguments): string {
    return `forms.error.validator.password.pwned`;
  }
}

export function IsPasswordNotPwned(
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      constraints: [],
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: PasswordNotPwned,
    });
  };
}
