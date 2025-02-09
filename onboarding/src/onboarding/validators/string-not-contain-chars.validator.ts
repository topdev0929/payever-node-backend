// tslint:disable: max-line-length
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({
  name: 'stringNotContainChars',
})
export class StringNotContainChars implements ValidatorConstraintInterface {
  public validate(value: string, validationArguments: ValidationArguments): boolean {
    const charsRe: RegExp = new RegExp(`[${validationArguments.constraints.join('')}]`, 'g');

    return !charsRe.test(value);
  }
  public defaultMessage(args: ValidationArguments): string {
    return `Value ($value) contains forbidden characters (${args.constraints.join('')})`;
  }
}

/**
 * @ref https://secure.n-able.com/webhelp/nc_9-1-0_so_en/content/sa_docs/api_level_integration
 * /api_integration_urlencoding.html
 */
export const URL_SPECIAL_SYMBOLS: string = '$&+,/:;=?@';
export const URL_MISUNDERSTOOD_SYMBOLS: string = ' "\'<>#%';
export const URL_BLACKLIST_SYMBOLS: string = URL_SPECIAL_SYMBOLS + URL_MISUNDERSTOOD_SYMBOLS;
