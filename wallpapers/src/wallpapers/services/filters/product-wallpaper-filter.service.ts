import { Injectable } from '@nestjs/common';
import { AbstractCollector, Collector } from '@pe/nest-kit';
import { ProductWallpapersDto, SearchDto } from 'src/wallpapers/dto';
import { PRODUCT_WALLPAPER_FILTER } from '../../../constants';
import { ProductWallpaperFilterInterface } from '../../interfaces';

@Injectable()
@Collector(PRODUCT_WALLPAPER_FILTER)
export class ProductWallpaperFilterCollector extends AbstractCollector {
  protected services: ProductWallpaperFilterInterface[];

  public async filterByAll(
    wallpaper: ProductWallpapersDto,
    condition: SearchDto,
  ): Promise<boolean> {
    let result: boolean = true;
    for (const validator of this.services) {
      result = result && await validator.filter(wallpaper, condition);
    }

    return result;
  }
}
