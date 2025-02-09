import { Injectable } from '@nestjs/common';
import { MediaAdditionalImageTypesEnum, MediaContainersEnum } from '@pe/media-sdk';
import { ImageTransformResult } from '../interfaces';
import { ArgumentMediaContainerEnum } from '../enum';

@Injectable()
export class MediaResizeResolver {

  private images: Map<ArgumentMediaContainerEnum, Map<MediaAdditionalImageTypesEnum, ImageTransformResult>>;

  constructor() {
    this.images = new Map();

    this.images.set(
      MediaContainersEnum.Wallpapers,
      this.getWallpapersImagesSizes(),
    );

    this.images.set(
      MediaContainersEnum.Products,
      this.getProductsImagesSizes(),
    );

    this.images.set(
      MediaContainersEnum.Images,
      this.getImageConainerImagesSizes(),
    );

    this.images.set(
      MediaContainersEnum.BuilderVideo,
      this.getImageConainerImagesSizes(),
    );
  }

  public getTransformParametersFor(
    containerName: ArgumentMediaContainerEnum,
    imageType: MediaAdditionalImageTypesEnum,
  ): ImageTransformResult {
    if (this.images.has(containerName) && this.images.get(containerName).has(imageType)) {
      return this.images.get(containerName).get(imageType);
    }

    return this.getDefaultResizeOptions();
  }

  private getWallpapersImagesSizes(): Map<MediaAdditionalImageTypesEnum, ImageTransformResult> {
    return this.buildResizeOptionsMap([
      {
        imageType: MediaAdditionalImageTypesEnum.Thumbnail,
        resizeDto: {
          height: 125,
          options: { fit: 'outside', withoutEnlargement: true },
          width: 200,
        },
      },
      {
        imageType: MediaAdditionalImageTypesEnum.Blurred,
        resizeDto: {
          blur: 150,
          height: 1440,
          options: { fit: 'inside', withoutEnlargement: true },
          width: 1920,
        },
      },
    ]);
  }

  private getProductsImagesSizes(): Map<MediaAdditionalImageTypesEnum, ImageTransformResult> {
    return this.buildResizeOptionsMap([
      {
        imageType: MediaAdditionalImageTypesEnum.Thumbnail,
        resizeDto: {
          height: 200,
          options: { fit: 'inside', withoutEnlargement: true },
          width: 200,
        },
      },
      {
        imageType: MediaAdditionalImageTypesEnum.GridThumbnail,
        resizeDto: {
          height: 600,
          options: { fit: 'inside', withoutEnlargement: true },
          width: 600,
        },
      },
    ]);
  }

  private getImageConainerImagesSizes(): Map<MediaAdditionalImageTypesEnum, ImageTransformResult> {
    return this.buildResizeOptionsMap([
      {
        imageType: MediaAdditionalImageTypesEnum.Thumbnail,
        resizeDto: {
          height: 100,
          options: { fit: 'inside', withoutEnlargement: true },
          width: 100,
        },
      },
    ]);
  }

  private buildResizeOptionsMap(
    options: Array<{ imageType: MediaAdditionalImageTypesEnum; resizeDto: ImageTransformResult}>,
  ): Map<MediaAdditionalImageTypesEnum, ImageTransformResult> {
    const map: Map<MediaAdditionalImageTypesEnum, ImageTransformResult> = new Map();

    for (const option of options) {
      map.set(option.imageType, option.resizeDto);
    }

    return map;
  }

  private getDefaultResizeOptions(): ImageTransformResult {
    return {
      height: 200,
      options: { fit: 'outside', withoutEnlargement: true },
      width: 200,
    };
  }
}
