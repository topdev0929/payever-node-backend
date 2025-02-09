import { Injectable } from '@nestjs/common';
import { Command, RabbitMqClient } from '@pe/nest-kit';
import { UserService } from '../services';
import { RabbitMessagesEnum } from '../../common';
import { User } from '../interfaces';
import { BusinessService } from '@pe/business-kit/modules';

@Injectable()
export class ExportNonInternalBusinessCommand {
  constructor(
    private readonly userService: UserService,
    private readonly businessService: BusinessService,
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  @Command({ command: 'export:non:internal:business', describe: 'export non internal businesses' })
  /* tslint:disable-next-line:no-ignored-initial-value */
  public async export(): Promise<void> {
    // todo: takedown, will be open occasionally when needed
    return ;
    if (
      process.env.KUBERNETES_INGRESS_NAMESPACE &&
      ['test', 'staging'].includes(process.env.KUBERNETES_INGRESS_NAMESPACE)
    ) {
      const emails: string[] = [
        'builder.staging@payever.org',
        'admin.default@payever.de',
        'commerceos.staging@payever.org',
        'payments.staging@payever.org',
        'publish.staging@payever.org',
        'products.staging@payever.org',
        'settings.staging@payever.org',
        'shipping.staging@payever.org',
        'sumandeep.kour@payever.org',
        'commerceos.user1@payever.org',
        'commerceos.user2@payever.org',
        'commerceos.user3@payever.org',
        'commerceos.user4@payever.org',
        'commerceos.user5@payever.org',
        'john1.alpha@payever.org',
        'john2.alpha@payever.org',
        'john3.alpha@payever.org',
        'john4.alpha@payever.org',
        'john5.alpha@payever.org',
        'john6.alpha@payever.org',
        'john1.beta@payever.org',
        'john2.beta@payever.org',
        'john3.beta@payever.org',
        'john4.beta@payever.org',
        'john5.beta@payever.org',
        'john6.beta@payever.org',
        'test@payever.org',
        'placeholder.staging@payever.org',
        'alfadmin@payever.org',
        'bertboss@payever.org',
        'test@krasnopv.com',
        'krasnopv@gmail.com',
        'commerceos.test@payever.org',
        'service@payever.de',
        'testcases@payever.de',
        'rob@top.com',
        'payments.test@payever.org',
        'admin.default@payever.de',
        'artillery@payever.de',
        'orkhan.ismayilov@payever.org',
        'test@krasnopv.com',
        'krasnopv@gmail.com',
      ];

      const users: User[] = await this.userService.find(
        {
          email : { $in : emails },
        },
      );

      const businesses: any[] = await this.businessService.findAll(
        {
          owner : { $nin : users.map((user: User) => user._id) },
        },
      );

      await this.rabbitClient.send(
        {
          channel: RabbitMessagesEnum.ExportNonInternalBusinesses,
          exchange: 'async_events',
        },
        {
          name: RabbitMessagesEnum.ExportNonInternalBusinesses,
          payload: {
            businessIds: businesses.map((business: any) => business._id),
          },
        },
        true,
      );
    }
  }
}
