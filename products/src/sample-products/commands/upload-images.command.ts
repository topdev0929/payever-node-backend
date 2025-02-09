import { Injectable } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { ProductCopyImageService } from '../../products';
import {
  BRANCHE_AUTOMOTIVE,
  BRANCHE_BABY,
  BRANCHE_CARE,
  BRANCHE_ELECTRONICS,
  BRANCHE_FASHION,
  BRANCHE_HEALTH_HOUSEHOLD,
  BRANCHE_HOME_KITCHEN,
  BRANCHE_LUGGAGE,
  BRANCHE_MATERIAL_HANDLINGS,
  BRANCHE_SPORTS,
  BRANCHE_TOYS,
} from '../../../migrations/20200226090957-sample-products/data';
import { SampleProductDto } from '../dto/sample-product.dto';

const productSampleList: SampleProductDto[][] = [
  BRANCHE_MATERIAL_HANDLINGS,
  BRANCHE_TOYS,
  BRANCHE_FASHION,
  BRANCHE_ELECTRONICS,
  BRANCHE_AUTOMOTIVE,
  BRANCHE_BABY,
  BRANCHE_SPORTS,
  BRANCHE_HOME_KITCHEN,
  BRANCHE_HEALTH_HOUSEHOLD,
  BRANCHE_CARE,
  BRANCHE_LUGGAGE,
];

const DEFAULT_BUSINESS_ID: string = 'fc50a44e-49e2-4517-bdda-335fd35d53ed';

@Injectable()
export class UploadImagesCommand {
  constructor(
    private readonly productCopyImageService: ProductCopyImageService,
  ) { }

  @Command({
    command: 'sample:upload:images',
    describe: 'Upload images from dropbox and get the url from azure blob',
  })
  public async setup(): Promise<void> {
    
    for (const productSamples of productSampleList) {
      for (const productSample of productSamples) {
        for (const productImage of productSample.images) {
          if (productImage.includes('dropboxusercontent')) {
            await this.productCopyImageService.importImages([productImage], DEFAULT_BUSINESS_ID, false);
          }
        }
      }
    }
  }
}
