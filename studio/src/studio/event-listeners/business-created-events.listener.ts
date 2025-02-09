import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessDto } from '../../business/dto';
import { BusinessEventsEnums } from '../../business/enums';
import { SampleGeneratorService, UserAlbumService } from '../services';

@Injectable()
export class BusinessCreatedEventsListener {
  constructor(
    private readonly sampleGeneratorService: SampleGeneratorService,
    private readonly userAlbumService: UserAlbumService,
  ) { }

  @EventListener(BusinessEventsEnums.BusinessCreated)
  public async onBusinessCreated(businessDto: BusinessDto): Promise<void> {
    await this.sampleGeneratorService.generateUserMediaSample(businessDto);
    await this.userAlbumService.createDefaultAlbum(businessDto._id);
  }
}
