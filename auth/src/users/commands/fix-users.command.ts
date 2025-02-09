import { Injectable, Logger } from '@nestjs/common';

import { Command, RabbitMqClient } from '@pe/nest-kit';
import { UserService } from '../services';
import { RabbitMessagesEnum } from '../../common';
import { User } from '../interfaces';

@Injectable()
export class FixUsersCommand {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) { }

  @Command({ command: 'auth:users:fix-acl-curruption', describe: 'Fix users from acl curruption in Auth' })
  public async export(): Promise<void> {
    this.logger.log(`Starting fixing users`);

    const users: User[] = await this.userService.find({
      roles: {
        $elemMatch: {
          name: 'merchant',
          permissions: {
            $elemMatch: {
              acls: { 
                $elemMatch: {
                  microservice : { $exists: false },
                },
              },
            },
          },
        },
      },
    });

    for (const user of users) {
      const roles: any = user.roles.map((role: any) => {
        return {
          name: role.name,
          permissions: role.permissions.map((permission: any) => {
            const acls: any = permission.acls.filter((acl: any) => {
              return !!acl.microservice;
            });
  
            return {
              acls,
              businessId: permission.businessId,
            };
          }),
        };
      });
  
      await this.userService.update(user._id, { roles: roles } as any);
    }

    this.logger.log(users.length + ' users were fixed');
  }
}
