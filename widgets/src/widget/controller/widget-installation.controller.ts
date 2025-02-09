import { Controller, Get, HttpCode, HttpException, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AccessTokenPayload,
  ParamModel,
  User,
  UserTokenInterface,
} from '@pe/nest-kit';
import { Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { BusinessModel } from '../../business/models';
import { MongooseModel } from '../../common/enums';
import { UserModel } from '../../user/models';
import { UserService } from '../../user/services';
import { WidgetInstallationStateInterface } from '../interfaces';
import { WidgetInstallationModel, WidgetModel } from '../models';
import { WidgetInstallationService } from '../services';

@Controller()
@ApiTags('widget')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class WidgetInstallationController {

  constructor(
    private readonly userService: UserService,
    private readonly installationService: WidgetInstallationService,
  ) { }

  @Get('personal/widget')
  @Roles(RolesEnum.user)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'Widgets list for user.',
    isArray: true,
    status: HttpStatus.OK,
  })
  public async findAllUserWidgets(
    @User() userToken: UserTokenInterface,
  ): Promise<Array<{ }>> {
    const user: UserModel = await this.userService.findOneById(userToken.id);
    let installationList: WidgetInstallationStateInterface[];
    if (user) {
      installationList = await this.installationService.getWidgetsStateByUser(user);
    } else {
      installationList = [];
    }
    const widgets: any[] = installationList.map((item: WidgetInstallationStateInterface) => ({
      __v: undefined,
      createdAt: undefined,
      installed: item.installed,
      ...item.widget.toObject(),
      tutorial: undefined,
      updatedAt: undefined,
    }));
    widgets.sort((a: any, b: any) => {
      if (a.order > b.order) { return -1; }
      if (a.order < b.order) { return  1; }
    });

    return widgets;
  }

  @Patch('personal/widget/:widgetId/install')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.OK, description: 'The widget has been successfully installed.' })
  public async installPersonal(
    @ParamModel('widgetId', MongooseModel.Widget) widget: WidgetModel,
    @User() userToken: UserTokenInterface,
  ): Promise<{ }> {
    const user: UserModel = await this.userService.findOneById(userToken.id);
    const installation: WidgetInstallationModel =
      await this.installationService.installToUser(widget, user);

    return {
      icon: installation.widget.icon,
      installed: installation.installed,
      order: installation.order,
      type: installation.widget.type,
    };
  }

  @Patch('personal/widget/:widgetId/uninstall')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.OK, description: 'The widget has been successfully uninstalled.' })
  public async uninstallPersonal(
    @ParamModel('widgetId', MongooseModel.Widget) widget: WidgetModel,
    @User() userToken: UserTokenInterface,
  ): Promise<{ }> {
    const user: UserModel = await this.userService.findOneById(userToken.id);

    if (widget.default) {
      throw new HttpException(
        {
          error: `Default widget can't be uninstalled`,
          status: HttpStatus.BAD_REQUEST,
        },
        400,
      );
    }

    const installation: WidgetInstallationModel =
      await this.installationService.uninstallFromUser(widget, user);

    return {
      icon: installation.widget.icon,
      installed: installation.installed,
      order: installation.order,
      type: installation.widget.type,
    };
  }

  @Get('business/:businessId/widget')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiResponse({
    description: 'Widgets list for business.',
    isArray: true,
    status: HttpStatus.OK,
  })
  public async findAllBusinessWidgets(
    @User() user: AccessTokenPayload,
    @ParamModel('businessId', MongooseModel.Business) business: BusinessModel,
  ): Promise<Array<{ }>> {
    if (!user) {
      return [];
    }

    const installationList: WidgetInstallationStateInterface[] =
      await this.installationService.getWidgetsStateByBusiness(business);

    const widgets: any[] = installationList.map((item: WidgetInstallationStateInterface) => ({
      __v: undefined,
      createdAt: undefined,
      installed: item.installed,
      ...item.widget.toObject(),
      tutorial: undefined,
      updatedAt: undefined,
    }));

    widgets.sort((a: any, b: any) => {
      if (a.order > b.order) { return -1; }
      if (a.order < b.order) { return  1; }
    });

    return widgets;
  }

  @Get('business/:businessId/widget/:widgetId')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.OK, description: 'State of widget for business.' })
  public async findOne(
    @ParamModel('widgetId', MongooseModel.Widget) widget: WidgetModel,
    @ParamModel('businessId', MongooseModel.Business) business: BusinessModel,
  ): Promise<{ }> {
    const installation: WidgetInstallationModel =
      await this.installationService.findOneByBusinessAndWidget(business, widget);

    return {
      __v: undefined,
      createdAt: undefined,
      installed: installation.installed,
      ...installation.widget.toObject(),
      tutorial: undefined,
      updatedAt: undefined,
    };
  }

  @Patch('business/:businessId/widget/:widgetId/install')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.OK, description: 'The widget has been successfully installed.' })
  public async install(
    @ParamModel('widgetId', MongooseModel.Widget) widget: WidgetModel,
    @ParamModel('businessId', MongooseModel.Business) business: BusinessModel,
  ): Promise<{ }> {
    const installation: WidgetInstallationModel =
      await this.installationService.installToBusiness(widget, business);

    return {
      icon: installation.widget.icon,
      installed: installation.installed,
      order: installation.order,
      type: installation.widget.type,
    };
  }

  @Patch('business/:businessId/widget/:widgetId/uninstall')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.OK, description: 'The widget has been successfully uninstalled.' })
  public async uninstall(
    @ParamModel('widgetId', MongooseModel.Widget) widget: WidgetModel,
    @ParamModel('businessId', MongooseModel.Business) business: BusinessModel,
  ): Promise<{ }> {

    if (widget.default) {
      throw new HttpException(
        {
          error: `Default widget can't be uninstalled`,
          status: HttpStatus.BAD_REQUEST,
        },
        400,
      );
    }

    const installation: WidgetInstallationModel =
      await this.installationService.uninstall(widget, business);

    return {
      icon: installation.widget.icon,
      installed: installation.installed,
      order: installation.order,
      type: installation.widget.type,
    };
  }
}
