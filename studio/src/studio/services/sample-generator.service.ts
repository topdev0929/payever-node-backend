import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessDto } from '../../business/dto';
import { SampleUserMediaInterface } from '../../sample-data/interfaces';
import { SampleDataService } from '../../sample-data/services';
import { UserMediaInterface } from '../interfaces';
import { UserMediaModel } from '../models';
import { UserMediaSchemaName } from '../schemas';

@Injectable()
export class SampleGeneratorService {
  constructor(
    @InjectModel(UserMediaSchemaName) private readonly userMediaModel: Model<UserMediaModel>,
    private readonly sampleDataService: SampleDataService,
  ) { }

  public async generateUserMediaSample(businessDto: BusinessDto): Promise<void> {
    const sampleMedias: SampleUserMediaInterface[] = await this.sampleDataService.getMedia();
    for (const sampleMedia of sampleMedias) {
      const userMediaInterface: UserMediaInterface = {
        businessId: businessDto._id,
        example: true,
        mediaType: sampleMedia.mediaType,
        name: sampleMedia.name,
        url: sampleMedia.url,
      };

      await this.userMediaModel.create(userMediaInterface);
    }
  }
}
