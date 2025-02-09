import { WallPaperThemeEnum } from '../enum';

export interface WallpaperInterface {
  wallpaper: string;
  theme: WallPaperThemeEnum;
  name?: string;
}
