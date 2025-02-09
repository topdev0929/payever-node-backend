import { WallpaperInterface } from './wallpaper.interface';
export interface CountryCityWallpapersInterface {
  city: string;
  country?: string;
  fullPath: string;
  wallpaper: WallpaperInterface;
}
