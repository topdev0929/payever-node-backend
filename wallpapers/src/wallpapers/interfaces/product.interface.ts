import { WallpaperInterface } from './wallpaper.interface';
import { ProductIndustryInterface } from './product-industry.interface';

export interface ProductInterface {
  code: string;
  wallpapers: WallpaperInterface[];
  industry: ProductIndustryInterface;
}
