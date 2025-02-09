// tslint:disable: object-literal-sort-keys
import { InteractionObject, Matchers } from '@pact-foundation/pact';

import { ACCESS_TOKEN_EXAMPLE, JWT_TOKEN_REGEXP } from '../const';

export class UsersInteractions {
  public static CreateBusinessTransaction(): InteractionObject {
    return {
      state: undefined,
      uponReceiving: 'a request to create new business',
      willRespondWith: {
        status: 200,
      },
      withRequest: {
        body: {
          id: 'e3507c44-0c8a-4f0c-a3ed-d5ef6ff0c9cf',
          email: 'merchant@example.com',
          firstName: undefined,
          lastName: undefined,
          name: 'John-Doe-Company-64',
          logo: 'e524f311-0bd2-4b19-b2db-96396870f763-small.jpg',
          companyAddress: {
            city: 'Ottawa',
            country: 'CA',
            street: '123 Fake Street',
            zipCode: 'a1b2c3',
          },
          companyDetails: {
            industry: 'BRANCHE_OTHER',
            phone: '154987711',
            product: 'Product-name',
          },
          contactDetails: {
            firstName: undefined,
            lastName: undefined,
            phone: '154987711',
          },
          active: true,
          hidden: false,
          bankAccount: {
            bankName: 'WhiteBank',
            bic: '44123312',
            city: 'Ottawa',
            country: 'CA',
            iban: '551233123',
            owner: 'King',
          },
          taxes: {
            companyRegisterNumber: '55123312',
            taxId: '512333123213',
            taxNumber: '551233354151',
            turnoverTaxAct: true,
          },
          contactEmails: [
            'inbox@company.org',
            'sales@company.org',
            'sales-company@gmail.com',
          ],
          defaultLanguage: 'FR',
          currency: undefined,
        },
        headers: {
          Authorization: Matchers.term({
            generate: `Bearer ${ACCESS_TOKEN_EXAMPLE}`,
            matcher: `^Bearer\\s${JWT_TOKEN_REGEXP}`,
          }),
          'Content-Type': Matchers.term({
            generate: 'application/json; charset=utf-8',
            matcher: '^application/json',
          }),
        },
        method: 'POST',
        path: Matchers.term({
          generate: `/api/business`,
          matcher: `/api/business`,
        }),
      },
    };
  }
}
