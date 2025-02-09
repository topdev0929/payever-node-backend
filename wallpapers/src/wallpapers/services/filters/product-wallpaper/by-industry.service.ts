import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';
import { ProductWallpaperFilterInterface } from '../../../interfaces';
import { PRODUCT_WALLPAPER_FILTER } from '../../../../constants';
import { ProductWallpapersDto, SearchDto } from '../../../dto';
import { ProductWallPaperFilterEnum, SearchEnum } from '../../../enum';

@Injectable()
@ServiceTag(PRODUCT_WALLPAPER_FILTER)
export class ProductWallpaperFilterByIndustryService implements ProductWallpaperFilterInterface {
  public async filter(
    wallpaper: ProductWallpapersDto,
    condition: SearchDto,
  ): Promise<boolean> {
    if (condition.filter !== ProductWallPaperFilterEnum.Industry) {
      return true;
    }

    if (
      (
        condition.contains === SearchEnum.Contain
        && wallpaper.industry?.toLowerCase().includes(condition.searchText.toLowerCase())
      )
      || (
        condition.contains === SearchEnum.DoesNotContain
        && !wallpaper.industry?.toLowerCase().includes(condition.searchText.toLowerCase())
      )
    ) {
      return true;
    }

    return false;
  }
}
