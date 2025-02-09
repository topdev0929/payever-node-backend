import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DashboardAppModel } from '@pe/app-registry-sdk';
import { Model } from 'mongoose';
import { InstalledApp, InstalledAppPopulatedApp } from '../../models/interfaces/installed-app';
import { UuidDocument } from '../../models/interfaces/uuid-document';
import { UserModel } from '../../models/user.model';
import { ToggleInstallAppDto, ToggleInstallDto } from '../dto';
import { RegisteredApp } from '../interfaces/registered-app';
import { UserService } from './user.service';

@Injectable()
export class UserAppsService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserModel>,
    @InjectModel('DashboardApps') private readonly dashboardAppModel: Model<DashboardAppModel>,
    private readonly userService: UserService,
  ) { }

  public async get(userId: string, userType: string): Promise<RegisteredApp[]> {
    const userPlain: UserModel = await this.getOrCreateUser(userId, userType);
    await userPlain.populate('installedApps.app').execPopulate();

    const user: Omit<UserModel, 'installedApps'> & {
      installedApps: InstalledAppPopulatedApp[];
    } = userPlain as any;

    const availableApps: DashboardAppModel[] = await this.dashboardAppModel.find({
      code: {
        $in: [
          'message',
          'transactions',
          'settings',
        ],
      },
    });

    return availableApps.map((availableApp: DashboardAppModel) => {
      const installed: InstalledAppPopulatedApp = user.installedApps.find(
        (installedApp: InstalledAppPopulatedApp) => installedApp.app._id === availableApp._id,
      );

      return RegisteredApp.parse({
        app: availableApp as any,
        installed: installed?.installed || false,
        setupStatus: installed?.setupStatus,
        setupStep: installed?.setupStep,
        statusChangedAt: installed?.statusChangedAt,
      });
    });
  }

  public async toggleInstalled(toggleDto: ToggleInstallAppDto, userId: string, userType: string): Promise<void> {
    const user: UserModel = await this.getOrCreateUser(userId, userType);

    let app: InstalledApp & UuidDocument = user.installedApps.find(
      (x: InstalledApp): boolean => x.app === toggleDto.microUuid,
    );
    if (!app) {
      app = user.installedApps.create({
        app: toggleDto.microUuid,
        code: toggleDto.code,
        installed: toggleDto.installed,
        setupStatus: toggleDto.setupStatus,
        statusChangedAt: toggleDto.statusChangedAt,
      } as InstalledApp);
      user.installedApps.push(app);
    } else {
      app.installed = toggleDto.installed;
      app.code = toggleDto.code ? toggleDto.code : app.code;
      app.setupStatus = toggleDto.setupStatus ? toggleDto.setupStatus : app.setupStatus;
      app.statusChangedAt = toggleDto.statusChangedAt ? toggleDto.statusChangedAt : app.statusChangedAt;
    }

    await user.save();
  }

  public async userToggleInstalled(
    toggleDto: ToggleInstallDto,
    microUuid: string,
    userId: string,
    userType: string,
  ): Promise<void> {
    const user: UserModel = await this.getOrCreateUser(userId, userType);

    let app: InstalledApp & UuidDocument = user.installedApps.find(
      (x: InstalledApp): boolean => x.app === microUuid,
    );
    if (!app) {
      const dashboardApp: DashboardAppModel = await this.dashboardAppModel.findOne( { _id: microUuid } );
      app = user.installedApps.create({
        app: microUuid,
        code: dashboardApp.code,
        installed: toggleDto.installed,
        setupStatus: toggleDto.setupStatus,
      } as InstalledApp);
      user.installedApps.push(app);
    } else {
      app.installed = toggleDto.installed;
      app.setupStatus = toggleDto.setupStatus ? toggleDto.setupStatus : app.setupStatus;
    }

    await user.save();
  }

  private getOrCreateUser(userId: string, userType: string): Promise<UserModel> {
    return this.userService.getOrCreate(userId, userType);
  }
}
