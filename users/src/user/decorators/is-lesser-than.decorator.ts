import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsLesserThan(property: string, validationOptions?: ValidationOptions): any {
  return (object: object, propertyName: string) => {
    registerDecorator({
      constraints: [property],
      name: 'isGreaterThan',
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: {
        validate(value: any, args: ValidationArguments): boolean {
          const [relatedPropertyName]: any = args.constraints;
          const relatedValue: any = args.object[relatedPropertyName];

          return relatedValue === undefined || value === null ||
            new Date(value) < relatedValue;
        },
      },
    });
  };
}
