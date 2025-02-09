import { ProductWallpapersDto, SearchDto } from '../dto';

export interface ProductWallpaperFilterInterface {
  filter(
    wallpaper: ProductWallpapersDto,
    condition: SearchDto,
  ): Promise<boolean>;
}
