import { WallpaperThemeEnum } from '../enums';

export interface WallpaperInterface {
  name?: string;
  wallpaper: string;
  theme: WallpaperThemeEnum;
}
