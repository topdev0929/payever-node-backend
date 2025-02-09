import { WallpaperInterface } from './wallpaper.interface';
export interface BusinessWallpapersInterface {
  businessId: string;
  myWallpapers: WallpaperInterface[];
  currentWallpaper?: WallpaperInterface;
  product?: string;
  industry?: string;
  type?: string;
}
