import { QueryCursor } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit';

import { WidgetInstallationService } from '../../widget/services';
import { UserService } from '../services';
import { UserModel } from '../models';

@Injectable()
export class InstallUserWidgetsCommander {
  constructor(
    private readonly usersService: UserService,
    private readonly widgetInstallationService: WidgetInstallationService,
    private readonly logger: Logger,
  ) { }

  @Command({
    command: 'widgets:install-default-to-users',
    describe: 'install default widgets to users',
  })
  public async installDefaultWidgetsToUsers(): Promise<void> {
    const allUsers: QueryCursor<UserModel> = this.usersService.find({ }).cursor({ batchSize: 250 });
    // tslint:disable-next-line: await-promise
    for await (const user of allUsers) {
      this.logger.verbose(`install default widgets for ${user._id}`);
      await this.widgetInstallationService.installWidgetsToUser(user);
    }
  }
}
