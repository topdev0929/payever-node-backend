import { v4 as uuid } from 'uuid';

const COLLECTION_NAME: string = 'taxes';

export async function up(db: any): Promise<void> {
    db._run(
      'insert',
      COLLECTION_NAME,
      {
        _id: uuid(),
        country: 'NO',
        description: 'Standard VAT rate',
        rate: 25,
      },
    );

  db._run(
    'insert',
    COLLECTION_NAME,
    {
      _id: uuid(),
      country: 'NO',
      description: 'Reduced VAT rate',
      rate: 15,
    },
  );
}

export function down(): Promise<void> {
  return null;
}
