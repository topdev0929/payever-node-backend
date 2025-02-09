import { Injectable } from '@nestjs/common';
import { MediaAdditionalImageTypesEnum, MediaContainersEnum } from '@pe/media-sdk';

@Injectable()
export class RestrictedMediaResolver {
  private containersMedia: any = { };

  public setRestrictedMediaList(container: MediaContainersEnum, list: string[]): void {
    this.containersMedia[container] = list;
  }

  public isRestricted(mediaName: string, container: string): boolean {
    if (this.containersMedia[container]) {
      const suffixesRegExp: RegExp = RestrictedMediaResolver.getAdditionalMediaRegexp();
      const mediaBaseName: string = mediaName.replace(suffixesRegExp, '');

      return this.containersMedia[container].indexOf(mediaBaseName) !== -1;
    }

    return false;
  }

  private static getAdditionalMediaRegexp(): RegExp {
    const suffixes: MediaAdditionalImageTypesEnum[] = [];
    for (const additionalMediaType of Object.keys(MediaAdditionalImageTypesEnum)) {
      suffixes.push(MediaAdditionalImageTypesEnum[additionalMediaType]);
    }
    const pattern: string = `-(${suffixes.join('|')})$`;

    return new RegExp(pattern);
  }
}
