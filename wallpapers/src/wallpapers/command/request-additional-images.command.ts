import { Injectable, Logger } from '@nestjs/common';
import { Command, Positional } from '@pe/nest-kit';
import { BusinessProductModel } from '../models';
import { MediaAdditionalImageTypesEnum, MediaContainersEnum, MediaEventsPublisher } from '@pe/media-sdk';
import { BusinessProductsService } from '../services';

@Injectable()
export class RequestAdditionalImagesCommand {
  constructor(
    private readonly businessProductsWallpapersService: BusinessProductsService,
    private readonly publisher: MediaEventsPublisher,
    private readonly logger: Logger,
  ) { }

  @Command({
    command: 'media:request-additional-images <imageType>',
    describe: 'Requests creation of additional images',
  })
  public async requestAdditionalImages(
    @Positional({ name: 'imageType' }) imageType: MediaAdditionalImageTypesEnum,
  ): Promise<void> {
    const businessProductsWallpapers: BusinessProductModel[]
      = await this.businessProductsWallpapersService.getAllBusinessProducts();
    for (const businessProduct of businessProductsWallpapers) {
      await this.requestAdditionalImagesForIndustry(businessProduct, imageType);
    }

    this.logger.log('Done!');
  }

  private async requestAdditionalImagesForIndustry(
    businessProduct: BusinessProductModel,
    imageType: MediaAdditionalImageTypesEnum,
  ): Promise<void> {
    const promises: Array<Promise<any>> = [];
    for (const wallpaper of businessProduct.wallpapers) {
      promises.push(
        this.publisher.publishAdditionalImageRequested(
          wallpaper.wallpaper,
          MediaContainersEnum.Wallpapers,
          imageType,
        ),
      );
    }

    await Promise.all(promises);
  }
}
