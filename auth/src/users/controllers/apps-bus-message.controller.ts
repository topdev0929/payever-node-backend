import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EventDispatcher, RolesEnum } from '@pe/nest-kit';
import { ACL_UPDATED_EVENT, MessageBusChannelsEnum } from '../../common';
import { defaultCommercesOsGroup } from '../../employees/constants';
import { ALL_APPS } from '../constants';
import { ApplicationInstalledDto, ApplicationUninstalledDto, OwnerTransferDto } from '../dto';
import { BusinessDto } from '../dto/business.dto';
import { Acl, User } from '../interfaces';
import { PermissionModel } from '../models';
import { UserService, PermissionService } from '../services';

@Controller()
export class AppsBusMessageController {
  constructor(
    private readonly userService: UserService,
    private readonly permissionService: PermissionService,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  @MessagePattern({
    name: 'apps.rpc.readonly.auth-install-onboarding-apps',
  })
  public async rpcInstallApps(
    body: {
      apps: string[];
      businessId: string;
      userId: string;
    },
  ): Promise<boolean> {

    let user: User = await this.userService.findOneBy({ _id: body.userId });

    user = await this.userService.addOnBoardingPermissions(
      user,
      body.businessId,
      [ ...body.apps, defaultCommercesOsGroup.microservice],
    );


    await this.eventDispatcher.dispatch(ACL_UPDATED_EVENT, [user], body.businessId);


    return true;
  }

  @MessagePattern({
    name: 'apps.readonly.auth-install-onboarding-apps',
  })
  public async installApps(
    body: {
      apps: string[];
      businessId: string;
      userId: string;
    },
  ): Promise<void> {

    let user: User = await this.userService.findOneBy({ _id: body.userId });

    user = await this.userService.addOnBoardingPermissions(
      user,
      body.businessId,
      [ ...body.apps, defaultCommercesOsGroup.microservice],
    );


    await this.eventDispatcher.dispatch(ACL_UPDATED_EVENT, [user], body.businessId);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: 'apps.rpc.readonly.auth-install-app',
  })
  public async onApplicationInstalledEvent(data: ApplicationInstalledDto): Promise<boolean> {
    return this.installOrUnistallApp(data, true);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: 'apps.rpc.readonly.auth-uninstall-app',
  })
  public async onApplicationUninstalledEvent(data: ApplicationUninstalledDto): Promise<boolean> {
    return this.installOrUnistallApp(data, false);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: 'users.event.business.owner-migrate',
  })
  public async onBusinessOwnerMigrateEvent(data: BusinessDto): Promise<void> {
    await this.addOwnerPermissions(data);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: 'users.event.business.owner-transfer',
  })
  public async onBusinessOwnerTransferEvent(data: OwnerTransferDto): Promise<void> {
    await this.permissionService.removeOne(data.businessId, data.previousOwnerId, RolesEnum.merchant);
    await this.addOwnerPermissions({ _id: data.businessId, userAccountId: data.newOwnerId });
  }

  private async addOwnerPermissions(data: BusinessDto): Promise<void> {
    const user: User = await this.userService.findOneBy({
      _id: data.userAccountId,
    });

    if (!user) {
      return;
    }

    const acls: Acl[] = ALL_APPS.map((app: any) => {
      return {
        create: true,
        delete: true,
        microservice: app.code,
        read: true,
        update: true,
      };
    });

    if (!acls.find((acl: Acl) => acl.microservice === defaultCommercesOsGroup.microservice)) {
      acls.push(defaultCommercesOsGroup);
    }

    await this.userService.addPermissions(
      user._id,
      data._id,
      acls,
    );
  }

  private async installOrUnistallApp(
    data: ApplicationInstalledDto | ApplicationUninstalledDto,
    install: boolean,
  ): Promise<boolean> {
    const users: User[] = await this.getUsersByBusinessId(data.businessId);

    const currentUser: User = users.find((user: User) => user._id === data.userId);

    if (currentUser) {
      await this.updateAcls([currentUser], data.businessId, data.code, install);
    }

    const otherUsers: User[] = users.filter((user: User) => user._id !== data.userId);

    this.updateAcls(otherUsers, data.businessId, data.code, install).catch();

    return true;
  }


  private async updateAcls(users: User[], businessId: string, code: string, install: boolean): Promise<void> {
    for (const user of users) {
      await this.userService.updatePermissions(
        user,
        businessId,
        [code],
        install,
      );
    }
  }

  private async getUsersByBusinessId(businessId: string): Promise<User[]> {
    return this.userService.find({
      roles: {
        $elemMatch: {
          permissions: {
            $in: (await this.permissionService.find({ businessId }))
              .map((permission: PermissionModel) => permission._id),
          },
        },
      },
    });
  }
}
