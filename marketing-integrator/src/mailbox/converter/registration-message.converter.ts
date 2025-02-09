import { Injectable } from '@nestjs/common';
import { RegistrationMessageInterface } from '../';
import { RegistrationFormKeysEnum } from '../enum';
import { environment } from '../../environment/environment';

@Injectable()
export class RegistrationMessageConverter {
  public static fromEmailBody(body: string): RegistrationMessageInterface | null {
    const fieldMap: { [k: string]: string } = RegistrationMessageConverter.bodyToFieldMap(body);

    if (!Object.keys(fieldMap).length) {
      return null;
    }

    if (!fieldMap.hasOwnProperty(RegistrationFormKeysEnum.ContactName)
      || !fieldMap.hasOwnProperty(RegistrationFormKeysEnum.Phone)
      || !fieldMap.hasOwnProperty(RegistrationFormKeysEnum.Email)
    ) {
      return null;
    }

    if (environment.ignoreEmails.includes(fieldMap[RegistrationFormKeysEnum.Email])) {
      return null;
    }

    if (fieldMap[RegistrationFormKeysEnum.ContactName].toLowerCase().includes('test')
      || (fieldMap.hasOwnProperty(RegistrationFormKeysEnum.BusinessName)
        && fieldMap[RegistrationFormKeysEnum.BusinessName].toLowerCase().includes('test')
      )
    ) {
      return null;
    }

    return {
      app: fieldMap[RegistrationFormKeysEnum.App],
      businessName: fieldMap[RegistrationFormKeysEnum.BusinessName],
      contactName: fieldMap[RegistrationFormKeysEnum.ContactName],
      countryCode: fieldMap[RegistrationFormKeysEnum.CountryCode],
      email: fieldMap[RegistrationFormKeysEnum.Email],
      phone: fieldMap[RegistrationFormKeysEnum.Phone],
      revenue: fieldMap[RegistrationFormKeysEnum.Revenue],
      website: fieldMap[RegistrationFormKeysEnum.Website],
    };
  }

  private static bodyToFieldMap(body: string): { [k: string]: string } {
    const lines: { } = { };

    body.split('\r\n').forEach((value: string) => {
      const pieces: string[] = value.split(':').map((piece: string) => piece.trim());
      if (pieces[1] && pieces[1].length) {
        lines[pieces[0]] = pieces[1];
      }
    });

    return lines;
  }
}
