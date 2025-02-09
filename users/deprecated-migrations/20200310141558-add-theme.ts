const businessesColletion: string = 'businesses';

export async function up(db) {
  await addThemeToBusinessWallpapers(db);

  return null;
}

async function addThemeToBusinessWallpapers(db): Promise<void> {
  const businesses = await db._run(
    'find',
    businessesColletion,
    {},
  );
  for (const business of businesses) {
    const currentWallpaper = business.wallpaper ? { wallpaper: business.wallpaper, theme: 'default' } : null;
    delete business.wallpaper

    await db._run(
      'update',
      businessesColletion,
      {
        query: { _id: business._id },
        update: {
          $set: { currentWallpaper },
          $unset: { wallpaper: "" },
        },
      },
    );
  }
}

export function down() {
  return null;
}
