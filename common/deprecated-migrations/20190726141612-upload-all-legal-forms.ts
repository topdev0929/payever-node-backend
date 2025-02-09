import { v4 as uuid } from 'uuid';
import { legalForms } from '../fixtures/legal-forms';

const COLLECTION_NAME: string = 'legalforms';

export async function up(db: any): Promise<void> {
  for (const legalForm of legalForms) {
    db._run(
      'insert',
      COLLECTION_NAME,
      {
        _id: uuid(),
        abbreviation: legalForm.abbreviation,
        country: legalForm.country,
        description: legalForm.description,
      },
    );
  }
}

export function down(): Promise<void> {
  return null;
}
