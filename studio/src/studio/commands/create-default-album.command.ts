import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { BusinessService } from '../../business/services';
import { BusinessModel } from '../../business/models';
import { UserAlbumService } from '../services';

@Injectable()
export class CreateDefaultAlbumCommand {
  constructor(
    private readonly businessService: BusinessService,
    private readonly userAlbumService: UserAlbumService,
    private readonly logger: Logger,
  ) { }

  @Command({
    command: 'create-default-album',
    describe: 'Create Default Album',
  })
  public async export(): Promise<void> {
    const businesses: BusinessModel[] = await this.businessService.findAll();

    for (const business of businesses) {
      this.logger.log(business._id);
      await this.userAlbumService.createDefault(business);
    }
  }
}
