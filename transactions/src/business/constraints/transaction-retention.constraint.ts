
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import * as moment from 'moment';

export function TransactionRetentionPeriod(
  constraints?: {
    min: moment.Duration;
    max: moment.Duration;
  },
  validationOptions?: ValidationOptions)
  : (object: object, propertyName: string) => void {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      constraints: [
        constraints?.min || moment.duration(2, 'days'),
        constraints?.max || moment.duration(5, 'years'),
      ],
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const duration: moment.Duration = moment.duration(value);
          const min: moment.Duration = args.constraints[0];
          const max: moment.Duration = args.constraints[1];

          return duration.isValid() &&
            duration > min &&
            duration <= max;
        },
        defaultMessage: (args: ValidationArguments) => {
          const min: moment.Duration = args.constraints[0];
          const max: moment.Duration = args.constraints[1];

          return `'($value)' should be a valid duration between ${min.humanize()}, and ${max.humanize()}`;
        },
      },
    });
  };
}
