import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { UserWallpapersService } from '../services';

@Injectable()
export class SetupDefaultFoldersCommand {
  constructor(
    private readonly logger: Logger,
    private readonly userWallpapersService: UserWallpapersService,
  ) { }

  @Command({
    command: 'setup:default-folders',
    describe: 'Setup Default Folders',
  })
  public async export(): Promise<void> {
    this.logger.log('Setup Default Folders started');
    await this.userWallpapersService
      .setupDefaultFolders();

    this.logger.log('Setup Default Folders finished');
  }
}
