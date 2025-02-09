import { Injectable } from '@nestjs/common';
import { Collector } from '@pe/nest-kit';
import { CollectorInterface } from '@pe/nest-kit/modules/collector-pattern/interfaces';
import { ArgumentMediaContainerEnum } from 'src/media/enum';
import { FsFile } from 'src/media/interfaces';
import { MimeTypesEnum } from '../../../tools/mime-types.enum';
import { ThumbnailGeneratorNotFoundException } from './exceptions';
import { ThumbnailGeneratorInterface, ThumbnailGeneratorResult } from './interfaces';

@Injectable()
@Collector('media-thumbnail-generator')
export class MediaThumbnailGeneratorWrapper implements CollectorInterface {
  protected services: ThumbnailGeneratorInterface[] = [];

  public async generate(container: ArgumentMediaContainerEnum, file: FsFile): Promise<ThumbnailGeneratorResult> {
    return this.getGenerator(file.mimeType as MimeTypesEnum).generate(container, file);
  }

  public doesSupport(mimeType: MimeTypesEnum): boolean {
    return !!this.findGenerator(mimeType);
  }

  public addService(service: ThumbnailGeneratorInterface): void {
    this.services.push(service);
  }

  private getGenerator(mimeType: MimeTypesEnum): ThumbnailGeneratorInterface {
    const generator: ThumbnailGeneratorInterface = this.findGenerator(mimeType);

    if (!generator) {
      throw new ThumbnailGeneratorNotFoundException(mimeType);
    }

    return generator;
  }

  private findGenerator(mimeType: MimeTypesEnum): ThumbnailGeneratorInterface {
    return this.services.find((generator: ThumbnailGeneratorInterface) => generator.doesSupport(mimeType));
  }
}
