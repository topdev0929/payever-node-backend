const businessWallpaperCollection: string = 'businesswallpapers';
const userWallpaperCollection: string = 'userwallpapers';
const businessProductWallpaperCollection: string = 'businessproductwallpapers';

export async function up(db) {
  await addThemeToBusinessWallpapers(db);
  await addThemeToUserWallpapers(db);
  await addThemeToBusinessProductWallpapers(db);

  return null;
}

async function addThemeToBusinessWallpapers(db): Promise<void> {
  const businessWallpapers = await db._run(
    'find',
    businessWallpaperCollection,
    {},
  );
  for (const businessWallpaper of businessWallpapers) {
    businessWallpaper.currentWallpaper = businessWallpaper.currentWallpaper ?
      { theme: 'default', wallpaper: businessWallpaper.currentWallpaper } : null;

    if (Array.isArray(businessWallpaper.myWallpapers)) {
      businessWallpaper.myWallpapers = businessWallpaper.myWallpapers.map(
        x => { return { theme: 'default', wallpaper: x } },
      );
    }

    await db._run(
      'update',
      businessWallpaperCollection,
      {
        query: { _id: businessWallpaper._id },
        update: { $set: businessWallpaper },
      },
    );
  }
}

async function addThemeToUserWallpapers(db): Promise<void> {
  const userWallpapers = await db._run(
    'find',
    userWallpaperCollection,
    {},
  );

  for (const userWallpaper of userWallpapers) {
    userWallpaper.currentWallpaper = userWallpaper.currentWallpaper ?
      { theme: 'default', wallpaper: userWallpaper.currentWallpaper } : null;

    if (Array.isArray(userWallpaper.myWallpapers)) {
      userWallpaper.myWallpapers = userWallpaper.myWallpapers.map(
        x => { return { wallpaper: x, theme: 'default' } },
      );
    }

    db._run(
      'update',
      userWallpaperCollection,
      {
        query: { _id: userWallpaper._id },
        update: { $set: userWallpaper },
      },
    );
  }
}

async function addThemeToBusinessProductWallpapers(db): Promise<void> {
  const businessProductWallpapers = await db._run(
    'find',
    businessProductWallpaperCollection,
    {},
  );

  for (const businessProductWallpaper of businessProductWallpapers) {
    if (Array.isArray(businessProductWallpaper.industries)) {
      for (const industry of businessProductWallpaper.industries) {
        if (Array.isArray(industry.wallpapers)) {
          industry.wallpapers = industry.wallpapers.map(
            x => { return { theme: 'default', wallpaper: x } },
          );
        }
      }

      await db._run(
        'update',
        businessProductWallpaperCollection,
        {
          query: { _id: businessProductWallpaper._id },
          update: { $set: businessProductWallpaper },
        },
      );
    }
  }
}

export function down() {
  return null;
}
