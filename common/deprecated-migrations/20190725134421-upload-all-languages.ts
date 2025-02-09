import * as isoCountriesLanguages from 'iso-countries-languages';

const COLLECTION_NAME: string = 'languages';

export async function up(db: any): Promise<void> {
  for (const language of isoCountriesLanguages.getSupportedLangs()) {
    const name: string = isoCountriesLanguages.getLanguage(language, language);
    if (name) {
      db._run(
        'update',
        COLLECTION_NAME,
        {
          options: { upsert: true },
          query: {
            _id: language,
          },
          update: {
            $set: {
              _id: language,
              englishName: isoCountriesLanguages.getLanguage('en', language),
              name,
            },
          },

        },
      );
    }
  }

  return null;
}

export function down(): Promise<void> {
  return null;
}
