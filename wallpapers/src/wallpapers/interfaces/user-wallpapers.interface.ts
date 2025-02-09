import { WallpaperInterface } from './wallpaper.interface';

export interface UserWallpapersInterface {
  user: string;
  myWallpapers: WallpaperInterface[];
  currentWallpaper?: WallpaperInterface;
}
