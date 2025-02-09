import { PostParseHandlerInterface } from './post-parse-handler.interface';
import { ProductDto, ProductVariantsDto } from '../../file-imports/dto/products';
import { FileImportDto, UploadedImageDto } from '../../file-imports/dto';
import { Injectable } from '@nestjs/common';
import { PostParseErrorDto, PostParseHandlerResultDto } from '../dto';

@Injectable()
export class UploadedImagesHandler implements PostParseHandlerInterface{

  public async handle(productDto: ProductDto[], importDto: FileImportDto): Promise<PostParseHandlerResultDto> {
    return this.substituteUploadedImagesInProducts(productDto, importDto.uploadedImages || []);
  }

  private substituteUploadedImagesInProducts(
    products: ProductDto[],
    uploadedImages: UploadedImageDto[],
  ): PostParseHandlerResultDto {
    const errors: PostParseErrorDto[] = [];
    const uploadedImagesMap: Map<string, UploadedImageDto> = new Map();
    for (const uploadedImage of uploadedImages) {
      uploadedImagesMap.set(uploadedImage.originalName, uploadedImage);
    }

    let mappedImages: string[] = [];
    let notMappedImages: string[] = [];

    for (const product of products) {
      product.images = this.mapImagesWithUploaded(
        product.images,
        uploadedImagesMap,
        (mapped: string[], notMapped: string[]) => {
          mappedImages = mappedImages.concat(mapped);
          notMappedImages = notMappedImages.concat(notMapped);
        });

      if (product.variants) {
        product.variants = product.variants.map((variant: ProductVariantsDto) => {
          variant.images = this.mapImagesWithUploaded(
            variant.images,
            uploadedImagesMap,
            (mapped: string[], notMapped: string[]): void => {
              mappedImages = mappedImages.concat(mapped);
              notMappedImages = notMappedImages.concat(notMapped);
            });

          return variant;
        });
      }
    }

    if (notMappedImages.length > 0) {
      errors.push({
        messages: [
          `Unable to find the below images to ` +
          `import. As there were no images uploaded. \n [${notMappedImages.join(', ')}]`,
        ],
      });
    }

    if (mappedImages.length !== uploadedImages.length) {
      const redundantImages: string[] = uploadedImages.filter(
        (image: UploadedImageDto) => mappedImages.indexOf(image.originalName) === -1,
      ).map((image: UploadedImageDto) => image.originalName);

      if (redundantImages.length > 0) {
        errors.push({
          messages: [
            `Unable to import the images below. ` +
            `Please map them to your file appropriately \n [${redundantImages.join(', ')}]`,
          ],
        });
      }
    }

    return { products, errors };
  }

  private mapImagesWithUploaded(
    originalImages: string[],
    uploadedImagesMap: Map<string, UploadedImageDto>,
    callback: (mapped: string[], notMapped: string[]) => void,
  ): string[] {
    const images: string[] = [];
    const notMapped: string[] = [];
    const mapped: string[] = [];
    for (const imageName of originalImages) {
      if (this.hasToBeReplacedWithUploaded(imageName)) {
        if (uploadedImagesMap.has(imageName)) {
          images.push(uploadedImagesMap.get(imageName).url);
          mapped.push(imageName);
        } else {
          notMapped.push(imageName);
        }
      } else {
        images.push(imageName);
      }
    }

    callback(mapped, notMapped);

    return images;
  }

  private hasToBeReplacedWithUploaded(filename: string): boolean {
    return !/^http(s?):\/\//i.test(filename);
  }
}
