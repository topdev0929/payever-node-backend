const businessesColletion: string = 'businesses';

export async function up(db: any): Promise<void> {
  await addThemeToBusinessWallpapers(db);

  return null;
}

async function addThemeToBusinessWallpapers(db: any): Promise<void> {
  const businesses: any[] = await db._run(
    'find',
    businessesColletion,
    {
      $or: [
        {
          'themeSettings.theme': 'dark',
        },
        {
          'currentWallpaper.theme': 'dark',
        },
      ],
    },
  );
  for (const business of businesses) {
    const update: any = {};

    if (business.themeSettings?.theme && business.themeSettings.theme === 'dark') {
      update['themeSettings.theme'] = 'default'
    }

    if (business.currentWallpaper?.theme && business.currentWallpaper.theme === 'dark') {
      update['currentWallpaper.theme'] = 'default'
    }

    await db._run(
      'update',
      businessesColletion,
      {
        query: { _id: business._id },
        update: {
          $set: update,
        },
      },
    );
  }
}

export function down(): void {
  return null;
}
