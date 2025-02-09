import { v4 as uuid } from 'uuid';

const COLLECTION_NAME: string = 'taxes';

export async function up(db: any): Promise<void> {
    db._run(
      'insert',
      COLLECTION_NAME,
      {
        _id: uuid(),
        country: 'MX',
        description: 'Standard VAT rate',
        rate: 16,
      },
    );

  db._run(
    'insert',
    COLLECTION_NAME,
    {
      _id: uuid(),
      country: 'MX',
      description: 'Zero VAT rate',
      rate: 0,
    },
  );

  db._run(
    'insert',
    COLLECTION_NAME,
    {
      _id: uuid(),
      country: 'BR',
      description: 'Standard VAT',
      rate: 17,
    },
  );

  db._run(
    'insert',
    COLLECTION_NAME,
    {
      _id: uuid(),
      country: 'BR',
      description: 'Sao Paulo VAT rate',
      rate: 18,
    },
  );

  db._run(
    'insert',
    COLLECTION_NAME,
    {
      _id: uuid(),
      country: 'BR',
      description: 'Rio de Janeiro VAT rate',
      rate: 19,
    },
  );

  db._run(
    'insert',
    COLLECTION_NAME,
    {
      _id: uuid(),
      country: 'BR',
      description: 'Federal V.A.T. rate (IPI) ',
      rate: 20,
    },
  );

  db._run(
    'insert',
    COLLECTION_NAME,
    {
      _id: uuid(),
      country: 'BR',
      description: 'Reduced VAT rate',
      rate: 7,
    },
  );

  db._run(
    'insert',
    COLLECTION_NAME,
    {
      _id: uuid(),
      country: 'BR',
      description: 'Zero VAT rate',
      rate: 0,
    },
  );



}

export function down(): Promise<void> {
  return null;
}
