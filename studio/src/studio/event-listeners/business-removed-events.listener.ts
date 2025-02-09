import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessDto } from '../../business/dto';
import { BusinessEventsEnums } from '../../business/enums';
import { UserMediaService } from '../services';

@Injectable()
export class BusinessRemovedEventsListener {
  constructor(
    private readonly userMediaService: UserMediaService,
  ) { }

  @EventListener(BusinessEventsEnums.BusinessRemoved)
  public async onBusinessRemoved(businessDto: BusinessDto): Promise<void> {
    await this.userMediaService.removeAllByBusinessId(businessDto._id);
  }
}
