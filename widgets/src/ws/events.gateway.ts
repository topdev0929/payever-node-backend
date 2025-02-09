import { forwardRef, Inject, Injectable, Logger, UseInterceptors } from '@nestjs/common';
import {
  OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { verify as jwtVerify } from 'jsonwebtoken';
import * as moment from 'moment';
import { Server } from 'socket.io';
import * as WebSocket from 'ws';

import { BusinessService } from '@pe/business-kit';
import {
  AccessTokenPayload, AclInterface, JwtStrategy, PermissionInterface,
  RolesEnum,
} from '@pe/nest-kit';
import { TokenHelper } from '@pe/nest-kit/modules/auth/token.helper';
import { AppointmentModel, AppointmentService } from '../apps/appointment-app';
import { BlogModel, BlogService } from '../apps/blog-app';
import { CheckoutModel, CheckoutService } from '../apps/checkout-app';
import {
  ConnectIntegrationService,
  ConnectIntegrationSubscriptionModel, ConnectIntegrationSubscriptionService,
} from '../apps/connect-app';
import { ContactService, GroupService } from '../apps/contact-app';
import { CouponModel, CouponService } from '../apps/coupon-app';
import { BusinessInvoiceService } from '../apps/invoice-app';
import { MessageService } from '../apps/message-app';
import { ChatModel } from '../apps/message-app/models';
import { PosService, PosTerminalModel } from '../apps/pos-app';
import { BusinessProductsAppService, ProductModel } from '../apps/products-app';
import { Randomizer } from '../apps/products-app/tools/randomizer';
import { ShippingService } from '../apps/shipping-app';
import { ShippingOrderStatsDto } from '../apps/shipping-app/interfaces';
import { ShopModel, ShopService } from '../apps/shop-app';
import { SiteModel, SiteService } from '../apps/site-app';
import { SocialPostModel, SocialPostService } from '../apps/social-app';
import { BusinessMediaModel, BusinessMediaService } from '../apps/studio-app';
import { SubscriptionService } from '../apps/subscriptions-app';
import {
  AdminTransactionsService, BusinessTransactionsService,
  DateRevenueInterface, UserTransactionsService,
} from '../apps/transactions-app';
import { BusinessModel } from '../business';
import { environment } from '../environments';
import { UserModel, UserService } from '../user';
import {
  WidgetInstallationService, WidgetInstallationStateInterface, WidgetModel, WidgetTutorialService,
  WidgetTutorialStateInterface,
} from '../widget';
import { WidgetInstallationModel } from '../widget/models/widget-installation.model';
import { WidgetService } from '../widget/services/widget.service';
import { WsIncomingEventCodeEnum } from './enums';
import { MessageNameEnum } from './enums/message-name.enum';
import { EventsService } from './events.service';
import {
  AdminContactsDataResponseInterface,
  AdminTransactionsLastDailyPayloadInterface,
  AdminTransactionsLastDailyResponseInterface,
  AdminTransactionsLastMonthlyPayloadInterface,
  AdminTransactionsLastMonthlyResponseInterface,
  BusinessBlogsDataResponseInterface,
  BusinessContactsDataResponseInterface,
  BusinessDefaultAppointmentDataPayloadInterface,
  BusinessDefaultAppointmentDataResponseInterface,
  BusinessDefaultBlogDataResponseInterface,
  BusinessDefaultCheckoutDataResponseInterface,
  BusinessDefaultCouponDataResponseInterface,
  BusinessDefaultMessageDataResponseInterface,
  BusinessDefaultPosTerminalDataPayloadInterface,
  BusinessDefaultPosTerminalDataResponseInterface,
  BusinessDefaultShopDataResponseInterface,
  BusinessDefaultSiteDataResponseInterface,
  BusinessDefaultSocialDataPayloadInterface,
  BusinessDefaultSocialDataResponseInterface,
  BusinessDefaultSubscriptionDataResponseInterface,
  BusinessInvoiceLastDailyResponseInterface,
  BusinessInvoiceLastMonthlyResponseInterface,
  BusinessProductsPopularMonthRandomResponseInterface,
  BusinessProductsPopularWeekRandomResponseInterface,
  BusinessShippingDataResponseInterface,
  BusinessStudioAppLastResponseInterface,
  BusinessTransactionsLastDailyPayloadInterface,
  BusinessTransactionsLastDailyResponseInterface,
  BusinessTransactionsLastMonthlyPayloadInterface,
  BusinessTransactionsLastMonthlyResponseInterface,
  BusinessWidgetConnectIntegrationNonInstalledResponseInterface,
  BusinessWidgetsResponseInterface,
  BusinessWidgetTutorialPayloadInterface,
  BusinessWidgetTutorialResponseInterface,
  InstallWidgetPayloadInterface,
  InstallWidgetResponseInterface,
  MessagePayloadInterface,
  RoomInterface,
  SocketWithToken,
  TransactionsLastDailyPayloadInterface,
  TransactionsLastDailyResponseInterface,
  TransactionsLastMonthlyPayloadInterface,
  TransactionsLastMonthlyResponseInterface,
  UninstallWidgetPayloadInterface,
  UninstallWidgetResponseInterface,
  WidgetsResponseInterface,
} from './interfaces';
import { MessageResponseToWsResponseInterceptor } from './interceptors';
import { BaseQueryDto } from '../common/dtos';
import { ShownWidgetsConstant } from './constants';

@Injectable()
@UseInterceptors(new MessageResponseToWsResponseInterceptor())
@WebSocketGateway({
  namespace: 'ws',
  path: '/ws/',
  transports: ['websocket'],
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  private connectedRooms: RoomInterface[] = [];

  public constructor(
    private readonly businessService: BusinessService,
    private readonly widgetService: WidgetService,
    private readonly userService: UserService,
    private readonly installationService: WidgetInstallationService,
    private readonly userTransactionsAppService: UserTransactionsService,
    private readonly businessTransactionsAppService: BusinessTransactionsService,
    private readonly businessInvoiceAppService: BusinessInvoiceService,
    private readonly businessMediaService: BusinessMediaService,
    private readonly productsAppService: BusinessProductsAppService,
    private readonly adminTransactionsAppService: AdminTransactionsService,
    private readonly checkoutService: CheckoutService,
    private readonly posService: PosService,
    private readonly shopService: ShopService,
    private readonly shippingService: ShippingService,
    private readonly siteService: SiteService,
    private readonly appointmentService: AppointmentService,
    private readonly blogService: BlogService,
    private readonly couponService: CouponService,
    private readonly contactService: ContactService,
    private readonly groupService: GroupService,
    private readonly messageService: MessageService,
    private readonly socialPostService: SocialPostService,
    private readonly subscriptionService: SubscriptionService,
    private readonly tutorialService: WidgetTutorialService,
    private readonly connectIntegrationSubscriptionService: ConnectIntegrationSubscriptionService,
    private readonly connectIntegrationService: ConnectIntegrationService,
    private readonly jwtService: JwtStrategy,
    @Inject(forwardRef(() => EventsService)) private wsService: EventsService,
    private readonly logger: Logger,
  ) { }

  public afterInit(server: Server): void {
    this.logger.log(`Ws Init`);
  }

  public async handleConnection(socket: SocketWithToken, ...args: any[]): Promise<void> {
    await this.wsService.handleConnectionEvent(socket);
  }

  public async handleDisconnect(socket: SocketWithToken): Promise<void> {
    await this.wsService.handleDisconnectEvent(socket);
  }

  @SubscribeMessage(WsIncomingEventCodeEnum.WsClientJoinBusinessRoom)
  public async onJoinBusinessRoom(
    clientSocket: SocketWithToken,
    businessId: string,
  ): Promise<void> {
    await this.wsService.joinMemberToBusinessRoom(clientSocket, businessId);
  }

  @SubscribeMessage(MessageNameEnum.ONBOARDING_STATUS)
  public async onBusinessOnboardingStatusEvent(
    client: SocketWithToken,
  ): Promise<BusinessWidgetsResponseInterface> {
    if (!client.businessId) {
      return {
        id: client.businessId,
        name: MessageNameEnum.ONBOARDING_STATUS,
        result: false,
      };
    }

    const business: BusinessModel =
      await this.businessService.findOneById(client.businessId) as unknown as BusinessModel;

    const result: boolean = await this.installationService.getOnboardingStatusByBusiness(business);

    return {
      id: client.businessId,
      name: MessageNameEnum.ONBOARDING_STATUS,
      result,
    };
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_WIDGETS)
  // tslint:disable-next-line: cognitive-complexity
  public async onBusinessWidgetsEvent(
    client: SocketWithToken,
  ): Promise<BusinessWidgetsResponseInterface> {
    const widgetsResponse: BusinessWidgetsResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_WIDGETS,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    const user: AccessTokenPayload = await this.verifyTokenAndExtractUserData(client.token);

    const business: BusinessModel =
      await this.businessService.findOneById(client.businessId) as unknown as BusinessModel;

    const installationList: WidgetInstallationStateInterface[] =
      await this.installationService.getWidgetsStateByBusiness(business);

    let widgets: any[] = installationList.map((item: WidgetInstallationStateInterface) => ({
      __v: undefined,
      createdAt: undefined,
      installed: item.installed,
      ...item.widget.toObject(),
      tutorial: undefined,
      updatedAt: undefined,
    }));

    const merchantRole: any = user.getRole(RolesEnum.merchant);
    if (merchantRole && merchantRole.permissions.length) {
      const businessPermission: PermissionInterface = merchantRole.permissions.find(
        (permission: PermissionInterface) => permission.businessId === business._id,
      );

      if (businessPermission && businessPermission.acls.length) {
        const filterredWidgets: any[] = widgets.filter(
          (widget: WidgetModel) => businessPermission.acls.some(
            (acl: AclInterface) => acl.microservice === widget.type && acl.read === true,
          ),
        );
        const appsWidget: any[] = widgets.find((widget: WidgetModel) => widget.type === 'apps');
        widgets = appsWidget ? [ appsWidget, ...filterredWidgets ] : filterredWidgets;
      }
    } else if (!user.isAdmin()) { // filter if no acls
      const filterredWidgets: any[] = widgets.filter(
        (widget: WidgetModel) => ShownWidgetsConstant.includes(widget.type),
      );
      const appsWidget: any[] = widgets.find((widget: WidgetModel) => widget.type === 'apps');
      widgets = appsWidget ? [ appsWidget, ...filterredWidgets ] : filterredWidgets;
    }

    widgets.sort((a: any, b: any) => {
      if (a.order > b.order) { return -1; }
      if (a.order < b.order) { return  1; }
    });

    widgetsResponse.widgets = widgets;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  /// ////////////////////////////////////////////////////////////
  /// ////////////////////////////////////////////////////////////
  /// ////////////////////////////////////////////////////////////
  /// ////////////////////////////////////////////////////////////
  /// ////////////////////////////////////////////////////////////

  // public async handleDisconnect(clientSocket: WebSocket): Promise<any> {
  //   this.connectedRooms = this.connectedRooms.filter((room: RoomInterface) => room.id === clientSocket.id);
  // }

  public async emitEventToRoom(businessId: string, event: MessageNameEnum, data: any): Promise<any> {
    const room: RoomInterface = this.connectedRooms.find((a: RoomInterface) => a.businessId === businessId);
    if (!room) {
      return;
    }

    this.server.to(room.businessId).emit(event, data);
  }

  /*
  @SubscribeMessage(MessageNameEnum.CONNECT)
  public async onConnectEvent(client: WebSocket, payload: ConnectPayloadInterface): Promise<ConnectResponseInterface> {
    const businessId: string = payload.id;

    // tslint:disable-next-line: no-commented-code
    // const widgetsResponse: ConnectResponseInterface = {
    //   id: businessId,
    //   name: MessageNameEnum.CONNECT,
    //   result: false,
    // };
    //
    // if (!await this.verifyTokenAndExtractUserData(payload.token) || !businessId) {
    //   return widgetsResponse;
    // }
    //
    // client.join(businessId);
    //
    // this.connectedRooms.push(
    //   {
    //     businessId,
    //     id: client.id,
    //   },
    // );

    return {
      id: businessId,
      name: MessageNameEnum.CONNECT,
      result: !!(await this.verifyTokenAndExtractUserData(payload.token)),
    };
  }

  @SubscribeMessage(MessageNameEnum.ONBOARDING_STATUS)
  public async onBusinessOnboardingStatusEvent(
    client: WebSocket,
    payload: BusinessWidgetsPayloadInterface,
  ): Promise<BusinessWidgetsResponseInterface> {

    const user: AccessTokenPayload = await this.verifyTokenAndExtractUserData(payload.token);
    const businessId: string = payload.id;

    const widgetsResponse: BusinessWidgetsResponseInterface = {
      id: businessId,
      name: MessageNameEnum.ONBOARDING_STATUS,
      result: false,
    };

    if (!user) {
      return widgetsResponse;
    }

    const business: BusinessModel = await this.businessService
    .findOneById(businessId) as unknown as BusinessModel;
    if (!business) {
      return widgetsResponse;
    }

    widgetsResponse.result = await this.installationService.getOnboardingStatusByBusiness(business);

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_WIDGETS)
  // tslint:disable-next-line: cognitive-complexity
  public async onBusinessWidgetsEvent(
    client: WebSocket,
    payload: BusinessWidgetsPayloadInterface,
  ): Promise<BusinessWidgetsResponseInterface> {

    const user: AccessTokenPayload = await this.verifyTokenAndExtractUserData(payload.token);
    const businessId: string = payload.id;

    const widgetsResponse: BusinessWidgetsResponseInterface = {
      id: businessId,
      name: MessageNameEnum.BUSINESS_WIDGETS,
      result: false,
    };

    if (!user) {
      return widgetsResponse;
    }

    const business: BusinessModel = await this.businessService
    .findOneById(businessId) as unknown as BusinessModel;
    if (!business) {
      return widgetsResponse;
    }

    const installationList: WidgetInstallationStateInterface[] =
      await this.installationService.getWidgetsStateByBusiness(business);

    let widgets: any[] = installationList.map((item: WidgetInstallationStateInterface) => ({
      __v: undefined,
      createdAt: undefined,
      installed: item.installed,
      ...item.widget.toObject(),
      tutorial: undefined,
      updatedAt: undefined,
    }));

    const merchantRole: any = user.getRole(RolesEnum.merchant);
    if (merchantRole && merchantRole.permissions.length) {
      const businessPermission: PermissionInterface = merchantRole.permissions.find(
        (permission: PermissionInterface) => permission.businessId === business._id,
      );

      if (businessPermission && businessPermission.acls.length) {

        const filterredWidgets: any[] = widgets.filter(
          (widget: WidgetModel) => businessPermission.acls.some(
            (acl: AclInterface) => acl.microservice === widget.type && acl.read === true,
          ),
        );
        const appsWidget: any[] = widgets.find((widget: WidgetModel) => widget.type === 'apps');
        widgets = appsWidget ? [ appsWidget, ...filterredWidgets ] : filterredWidgets;
      }
    }

    widgets.sort((a: any, b: any) => {
      if (a.order > b.order) { return -1; }
      if (a.order < b.order) { return  1; }
    });

    widgetsResponse.widgets = widgets;
    widgetsResponse.result = true;

    return widgetsResponse;
  }
  */

  @SubscribeMessage(MessageNameEnum.BUSINESS_TRANSACTIONS_LAST_DAILY)
  public async onBusinessLastDailyEvent(
    client: SocketWithToken,
    payload: BusinessTransactionsLastDailyPayloadInterface,
  ): Promise<BusinessTransactionsLastDailyResponseInterface> {

    const widgetsResponse: BusinessTransactionsLastDailyResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_TRANSACTIONS_LAST_DAILY,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    const business: BusinessModel =
      await this.businessService.findOneById(client.businessId) as unknown as BusinessModel;

    const transactions: DateRevenueInterface[] =
      await this.businessTransactionsAppService.getLastDailyRevenues(business, payload.numDays);

    widgetsResponse.transactions = transactions;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_TRANSACTIONS_LAST_MONTHLY)
  public async onBusinessLastMonthlyEvent(
    client: SocketWithToken,
    payload: BusinessTransactionsLastMonthlyPayloadInterface,
  ): Promise<BusinessTransactionsLastMonthlyResponseInterface> {

    const widgetsResponse: BusinessTransactionsLastMonthlyResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_TRANSACTIONS_LAST_MONTHLY,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    const business: BusinessModel =
      await this.businessService.findOneById(client.businessId) as unknown as BusinessModel;

    const transactions: DateRevenueInterface[] =
      await this.businessTransactionsAppService.getLastMonthlyRevenues(business, payload.months);

    widgetsResponse.transactions = transactions;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_INVOICE_LAST_DAILY)
  public async onBusinessInvoiceLastDailyEvent(
    client: SocketWithToken,
    payload: BusinessTransactionsLastDailyPayloadInterface,
  ): Promise<BusinessInvoiceLastDailyResponseInterface> {

    const widgetsResponse: BusinessInvoiceLastDailyResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_INVOICE_LAST_DAILY,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    const business: BusinessModel =
      await this.businessService.findOneById(client.businessId) as unknown as BusinessModel;

    const invoices: DateRevenueInterface[] =
      await this.businessInvoiceAppService.getLastDailyRevenues(business, payload.numDays);

    widgetsResponse.invoices = invoices;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_INVOICE_LAST_MONTHLY)
  public async onBusinessInvoiceLastMonthlyEvent(
    client: SocketWithToken,
    payload: BusinessTransactionsLastMonthlyPayloadInterface,
  ): Promise<BusinessInvoiceLastMonthlyResponseInterface> {

    const widgetsResponse: BusinessInvoiceLastMonthlyResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_INVOICE_LAST_MONTHLY,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    const business: BusinessModel =
      await this.businessService.findOneById(client.businessId) as unknown as BusinessModel;

    const invoices: DateRevenueInterface[] =
      await this.businessInvoiceAppService.getLastMonthlyRevenues(business, payload.months);

    widgetsResponse.invoices = invoices;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_STUDIO_APP_LAST)
  public async onBusinessStudioAppLastEvent(
    client: SocketWithToken,
    // payload: BusinessStudioAppLastPayloadInterface,
  ): Promise<BusinessStudioAppLastResponseInterface> {

    const widgetsResponse: BusinessStudioAppLastResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_STUDIO_APP_LAST,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    const business: BusinessModel =
      await this.businessService.findOneById(client.businessId) as unknown as BusinessModel;

    const media: BusinessMediaModel[] = await this.businessMediaService.getMediaList(business);

    widgetsResponse.media = media;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_PRODUCTS_POPULAR_WEEK_RANDOM)
  public async onBusinessProductsPopularWeekRandomEvent(
    client: SocketWithToken,
    // payload: BusinessProductsPopularWeekRandomPayloadInterface,
  ): Promise<BusinessProductsPopularWeekRandomResponseInterface> {

    const widgetsResponse: BusinessProductsPopularWeekRandomResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_PRODUCTS_POPULAR_WEEK_RANDOM,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    const business: BusinessModel =
      await this.businessService.findOneById(client.businessId) as unknown as BusinessModel;

    const products: any[] = Randomizer.shuffleArray(await this.productsAppService.getPopularLastWeek(business))
      .map((item: ProductModel) => ({
        ...item.toObject(),
        currency: business.currency,
        lastSell: item.lastSell ? item.lastSell : (new Date()).toJSON(),
        quantity: item.quantity ? item.quantity : 0,
      }));

    widgetsResponse.products = products;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_PRODUCTS_POPULAR_MONTH_RANDOM)
  public async onBusinessProductsPopularMonthRandomEvent(
    client: SocketWithToken,
    // payload: BusinessProductsPopularMonthRandomPayloadInterface,
  ): Promise<BusinessProductsPopularMonthRandomResponseInterface> {

    const widgetsResponse: BusinessProductsPopularMonthRandomResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_PRODUCTS_POPULAR_MONTH_RANDOM,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    const business: BusinessModel = await this.businessService.findOneById(
      client.businessId,
    ) as unknown as BusinessModel;

    const products: any[] = Randomizer.shuffleArray(await this.productsAppService.getPopularLastMonth(business))
      .map((item: ProductModel) => ({
        ...item.toObject(),
        currency: business.currency,
        lastSell: item.lastSell ? item.lastSell : (new Date()).toJSON(),
        quantity: item.quantity ? item.quantity : 0,
      }));

    widgetsResponse.products = products;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.PERSONAL_WIDGETS)
  public async onPersonalWidgetsEvent(
    client: SocketWithToken,
    // payload: WidgetsPayloadInterface,
  ): Promise<WidgetsResponseInterface> {

    const userData: AccessTokenPayload = await this.verifyTokenAndExtractUserData(client.token);

    const widgetsResponse: WidgetsResponseInterface = {
      id: userData ? userData.id : undefined,
      name: MessageNameEnum.PERSONAL_WIDGETS,
      result: false,
    };

    if (!userData) {
      return widgetsResponse;
    }

    const user: UserModel = await this.userService.findOneById(userData.id);
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

    widgetsResponse.widgets = widgets;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.PERSONAL_TRANSACTIONS_LAST_DAILY)
  public async onPersonalLastDailyEvent(
    client: SocketWithToken,
    payload: TransactionsLastDailyPayloadInterface,
  ): Promise<TransactionsLastDailyResponseInterface> {

    const userData: AccessTokenPayload = await this.verifyTokenAndExtractUserData(client.token);

    const response: TransactionsLastDailyResponseInterface = {
      id: userData ? userData.id : undefined,
      name: MessageNameEnum.PERSONAL_TRANSACTIONS_LAST_DAILY,
      result: false,
    };

    if (!userData) {
      return response;
    }

    const user: UserModel = await this.userService.findOneById(userData.id);

    const transactions: DateRevenueInterface[] =
      await this.userTransactionsAppService.getLastDailyRevenues(user, payload.numDays);

    response.transactions = transactions;
    response.result = true;

    return response;
  }

  @SubscribeMessage(MessageNameEnum.PERSONAL_TRANSACTIONS_LAST_MONTHLY)
  public async onPersonalLastMonthlyEvent(
    client: SocketWithToken,
    payload: TransactionsLastMonthlyPayloadInterface,
  ): Promise<TransactionsLastMonthlyResponseInterface> {

    const userData: AccessTokenPayload = await this.verifyTokenAndExtractUserData(client.token);

    const response: TransactionsLastMonthlyResponseInterface = {
      id: userData ? userData.id : undefined,
      name: MessageNameEnum.PERSONAL_TRANSACTIONS_LAST_MONTHLY,
      result: false,
    };

    if (!userData) {
      return response;
    }

    const user: UserModel = await this.userService.findOneById(userData.id);

    const transactions: DateRevenueInterface[] =
      await this.userTransactionsAppService.getLastMonthlyRevenues(user, payload.months);

    response.transactions = transactions;
    response.result = true;

    return response;
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_DEFAULT_CHECKOUT_DATA)
  public async onBusinessDefaultCheckoutDataEvent(
    client: SocketWithToken,
    // payload: BusinessDefaultCheckoutDataPayloadInterface,
  ): Promise<BusinessDefaultCheckoutDataResponseInterface> {

    const widgetsResponse: BusinessDefaultCheckoutDataResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_DEFAULT_CHECKOUT_DATA,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    const checkout: CheckoutModel = await this.checkoutService.getDefaultBusinessCheckout(client.businessId);
    if (!checkout) {
      return widgetsResponse;
    }

    widgetsResponse.checkoutId = checkout.id;
    widgetsResponse.checkoutName = checkout.name;
    widgetsResponse.linkChannelSetId = checkout.linkChannelSetId;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_DEFAULT_POS_TERMINAL_DATA)
  public async onBusinessDefaultPosTerminalDataEvent(
    client: SocketWithToken,
    payload: BusinessDefaultPosTerminalDataPayloadInterface,
  ): Promise<BusinessDefaultPosTerminalDataResponseInterface> {

    const widgetsResponse: BusinessDefaultPosTerminalDataResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_DEFAULT_POS_TERMINAL_DATA,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    const posTerminal: PosTerminalModel = await this.posService.getDefaultBusinessPosTerminal(client.businessId);
    if (!posTerminal) {
      return widgetsResponse;
    }

    widgetsResponse.terminalId = posTerminal.id;
    widgetsResponse.terminalName = posTerminal.name;
    widgetsResponse.terminalLogo = posTerminal.logo;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_DEFAULT_SHOP_DATA)
  public async onBusinessDefaultShopDataEvent(
    client: SocketWithToken,
    // payload: BusinessDefaultShopDataPayloadInterface,
  ): Promise<BusinessDefaultShopDataResponseInterface> {

    const widgetsResponse: BusinessDefaultShopDataResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_DEFAULT_SHOP_DATA,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    const shop: ShopModel = await this.shopService.getDefaultBusinessShop(client.businessId);
    if (!shop) {
      return widgetsResponse;
    }

    widgetsResponse.shopId = shop.id;
    widgetsResponse.shopName = shop.name;
    widgetsResponse.shopLogo = shop.logo;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_DEFAULT_APPOINTMENTS_DATA)
  public async onBusinessDefaultAppointmentDataEvent(
    client: SocketWithToken,
    payload: BusinessDefaultAppointmentDataPayloadInterface,
  ): Promise<BusinessDefaultAppointmentDataResponseInterface> {

    const widgetsResponse: BusinessDefaultAppointmentDataResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_DEFAULT_APPOINTMENTS_DATA,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    const appointments: AppointmentModel[] = await this.appointmentService.getAllBusinessAppointment(payload.id);

    widgetsResponse.appointments = appointments;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_DEFAULT_SOCIAL_DATA)
  public async onBusinessDefaultSocialDataEvent(
    client: SocketWithToken,
    payload: BusinessDefaultSocialDataPayloadInterface,
  ): Promise<BusinessDefaultSocialDataResponseInterface> {

    const widgetsResponse: BusinessDefaultSocialDataResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_DEFAULT_SOCIAL_DATA,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    const postModels: SocialPostModel[] = await this.socialPostService.findAllByBusiness(payload.id);
    widgetsResponse.posts = postModels;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_DEFAULT_SITE_DATA)
  public async onBusinessDefaultSiteDataEvent(
    client: SocketWithToken,
    // payload: BusinessDefaultSiteDataPayloadInterface,
  ): Promise<BusinessDefaultSiteDataResponseInterface> {

    const widgetsResponse: BusinessDefaultSiteDataResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_DEFAULT_SITE_DATA,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    const site: SiteModel = await this.siteService.getDefaultBusinessSite(client.businessId);
    if (!site) {
      return widgetsResponse;
    }

    widgetsResponse.siteId = site.id;
    widgetsResponse.siteName = site.name;
    widgetsResponse.siteLogo = site.logo;
    widgetsResponse.siteUrl = site.url;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_DEFAULT_BLOG_DATA)
  public async onBusinessDefaultBlogDataEvent(
    client: SocketWithToken,
    // payload: BusinessDefaultBlogDataPayloadInterface,
  ): Promise<BusinessDefaultBlogDataResponseInterface> {

    const widgetsResponse: BusinessDefaultBlogDataResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_DEFAULT_BLOG_DATA,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    const blog: BlogModel = await this.blogService.getDefaultBusinessBlog(client.businessId);
    if (!blog) {
      return widgetsResponse;
    }

    widgetsResponse.blogId = blog.id;
    widgetsResponse.blogName = blog.title;
    widgetsResponse.blogLogo = blog.image;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_BLOGS)
  public async onBusinessBlogsDataEvent(
    client: SocketWithToken,
    // payload: BusinessBlogsDataPayloadInterface,
  ): Promise<BusinessBlogsDataResponseInterface> {

    const widgetsResponse: BusinessBlogsDataResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_BLOGS,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    const blogs: BlogModel[] = await this.blogService.getAllBusinessBlogs(client.businessId);
    if (!blogs) {
      return widgetsResponse;
    }

    widgetsResponse.blogs = blogs;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_DEFAULT_COUPON_DATA)
  public async onBusinessDefaultCouponDataEvent(
    client: SocketWithToken,
    // payload: BusinessDefaultCouponDataPayloadInterface,
  ): Promise<BusinessDefaultCouponDataResponseInterface> {

    const widgetsResponse: BusinessDefaultCouponDataResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_DEFAULT_COUPON_DATA,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    const coupon: CouponModel = await this.couponService.getActiveBusinessCoupon(client.businessId);

    widgetsResponse.coupon = coupon;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  public async sendBusinessMessageDataUpdatedEvent(chats: ChatModel[]): Promise<void> {
    if (!chats.length) { return; }
    await this.emitEventToRoom(
      chats[0].businessId,
      MessageNameEnum.BUSINESS_DEFAULT_MESSAGE_DATA,
      {
        id: chats[0].businessId,
        name: MessageNameEnum.BUSINESS_DEFAULT_MESSAGE_DATA,
        result: chats,
      },
    );
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_DEFAULT_MESSAGE_DATA)
  public async onBusinessMessageDataEvent(
    client: SocketWithToken,
    dto: BaseQueryDto,
  ): Promise<BusinessDefaultMessageDataResponseInterface> {

    const widgetsResponse: BusinessDefaultMessageDataResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_DEFAULT_MESSAGE_DATA,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    const userId: string = client.decodedToken.user?.id;
    const chats: ChatModel[] =
      await this.messageService.getBusinessChat(
        client.businessId,
        userId,
        { limit: 20, ...dto },
      );

    widgetsResponse.chats = chats;
    widgetsResponse.result = true;

    return widgetsResponse;
  }


  @SubscribeMessage(MessageNameEnum.PERSONAL_DEFAULT_MESSAGE_DATA)
  public async onPersonalMessageDataEvent(
    client: SocketWithToken,
  ): Promise<BusinessDefaultMessageDataResponseInterface> {

    const userData: AccessTokenPayload = await this.verifyTokenAndExtractUserData(client.token);

    const response: BusinessDefaultMessageDataResponseInterface = {
      id: userData ? userData.id : undefined,
      name: MessageNameEnum.PERSONAL_DEFAULT_MESSAGE_DATA,
      result: false,
    };

    if (!userData) {
      return response;
    }

    const user: UserModel = await this.userService.findOneById(userData.id);

    if (!user) {
      return response;
    }

    const chats: ChatModel[] = await this.messageService
      .getPersonalChat(userData.id);

    response.chats = chats;
    response.result = true;

    return response;
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_CONTACTS_DATA)
  public async onBusinessContactsDataEvent(
    client: SocketWithToken,
    // payload: MessagePayloadInterface & { id: string },
  ): Promise<BusinessContactsDataResponseInterface> {

    const widgetsResponse: BusinessContactsDataResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_CONTACTS_DATA,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    widgetsResponse.contactsCount = await this.contactService.count(client.businessId);
    widgetsResponse.groupsCount = await this.groupService.count(client.businessId);

    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_DEFAULT_SUBSCRIPTION_DATA)
  public async onBusinessSubscriptionDataEvent(
    client: SocketWithToken,
    payload: MessagePayloadInterface & { id: string },
  ): Promise<BusinessDefaultSubscriptionDataResponseInterface> {

    const widgetsResponse: BusinessDefaultSubscriptionDataResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_DEFAULT_SUBSCRIPTION_DATA,
      result: false,
    };

    if (!this.verifyToken(payload.token)) {
      return widgetsResponse;
    }

    if (!client.businessId) {
      return widgetsResponse;
    }

    const data: any = await this.subscriptionService
    .getBusinessStatistics(client.businessId, moment().subtract(30, 'days').toDate());

    widgetsResponse.subscribed = data.subscribed;
    widgetsResponse.total = data.total;
    widgetsResponse.unsubscribed = data.unsubscribed;

    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_SHIPPING_DATA)
  public async onBusinessShippingDataEvent(
    client: SocketWithToken,
    payload: MessagePayloadInterface & { id: string },
  ): Promise<BusinessShippingDataResponseInterface> {

    const widgetsResponse: BusinessShippingDataResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_SHIPPING_DATA,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    const data: ShippingOrderStatsDto = await this.shippingService
      .getShippingOrderStatisticsByBusiness(client.businessId, payload.token);

    widgetsResponse.returned = data.return;
    widgetsResponse.shipped = data.shipped;
    widgetsResponse.cancelled = data.cancelled;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.BUSINESS_WIDGET_TUTORIAL)
  public async onBusinessWidgetTutorialEvent(
    client: SocketWithToken,
    payload: BusinessWidgetTutorialPayloadInterface,
  ): Promise<BusinessWidgetTutorialResponseInterface> {

    const widgetsResponse: BusinessWidgetTutorialResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.BUSINESS_WIDGET_TUTORIAL,
      result: false,
    };

    if (!await this.verifyTokenAndExtractUserData(payload.token)) {
      return widgetsResponse;
    }

    if (!client.businessId) {
      return widgetsResponse;
    }

    const business: BusinessModel =
      await this.businessService.findOneById(client.businessId) as unknown as BusinessModel;

    const tutorialList: WidgetTutorialStateInterface[] =
      await this.tutorialService.getWidgetsTutorialStateByBusiness(business);
    if (!tutorialList || !tutorialList.length) {
      return widgetsResponse;
    }

    widgetsResponse.tutorialList = tutorialList.map((item: WidgetTutorialStateInterface) => ({
      watched: item.watched,
      widgetId: item.widget._id,
      widgetOrder: item.widget.order,
      widgetType: item.widget.type,
      ...item.widget.tutorial,
    }));
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.WIDGET_CONNECT_INTEGRATION_NON_INSTALLED)
  public async onWidgetConnectIntegrationNonInstalled(
    client: SocketWithToken,
    // payload: BusinessWidgetConnectIntegrationNonInstalledPayloadInterface,
  ): Promise<BusinessWidgetConnectIntegrationNonInstalledResponseInterface> {

    const widgetsResponse: BusinessWidgetConnectIntegrationNonInstalledResponseInterface = {
      id: client.businessId,
      name: MessageNameEnum.WIDGET_CONNECT_INTEGRATION_NON_INSTALLED,
      result: false,
    };

    if (!client.businessId) {
      return widgetsResponse;
    }

    const subscriptions: ConnectIntegrationSubscriptionModel[] =
      await this.connectIntegrationSubscriptionService.findInstalledByBusiness(client.businessId);
    const integrationIds: string[] =
      subscriptions.map((subscription: ConnectIntegrationSubscriptionModel) => subscription.integration as any);

    widgetsResponse.integrations = await this.connectIntegrationService.findExceptIds(integrationIds);
    widgetsResponse.integrations.sort(() => Math.random() - 0.5);
    widgetsResponse.integrations = widgetsResponse.integrations.slice(0, 3);
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.ADMIN_TRANSACTIONS_LAST_DAILY)
  public async onAdminLastDailyEvent(
    client: SocketWithToken,
    payload: AdminTransactionsLastDailyPayloadInterface,
  ): Promise<AdminTransactionsLastDailyResponseInterface> {

    const userData: AccessTokenPayload = await this.verifyTokenAndExtractUserData(client.token);

    const widgetsResponse: AdminTransactionsLastDailyResponseInterface = {
      name: MessageNameEnum.ADMIN_TRANSACTIONS_LAST_DAILY,
      result: false,
    };

    if (!userData || !userData.isAdmin()) {
      return widgetsResponse;
    }

    const user: UserModel = await this.userService.findOneById(userData.id);

    const transactions: DateRevenueInterface[] =
      await this.adminTransactionsAppService.getLastDailyRevenues(user, payload.numDays);

    widgetsResponse.transactions = transactions;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.ADMIN_TRANSACTIONS_LAST_MONTHLY)
  public async onAdminLastMonthlyEvent(
    client: SocketWithToken,
    payload: AdminTransactionsLastMonthlyPayloadInterface,
  ): Promise<AdminTransactionsLastMonthlyResponseInterface> {

    const userData: AccessTokenPayload = await this.verifyTokenAndExtractUserData(client.token);

    const widgetsResponse: AdminTransactionsLastMonthlyResponseInterface = {
      name: MessageNameEnum.ADMIN_TRANSACTIONS_LAST_DAILY,
      result: false,
    };

    if (!userData || !userData.isAdmin()) {
      return widgetsResponse;
    }

    const user: UserModel = await this.userService.findOneById(userData.id);

    const transactions: DateRevenueInterface[] =
      await this.adminTransactionsAppService.getLastMonthlyRevenues(user, payload.months);

    widgetsResponse.transactions = transactions;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.ADMIN_CONTACT_DATA)
  public async onAdminContactsDataEvent(
    client: SocketWithToken,
    // payload: MessagePayloadInterface,
  ): Promise<AdminContactsDataResponseInterface> {

    const userData: AccessTokenPayload = await this.verifyTokenAndExtractUserData(client.token);

    const widgetsResponse: AdminContactsDataResponseInterface = {
      name: MessageNameEnum.ADMIN_CONTACT_DATA,
      result: false,
    };

    if (!userData || !userData.isAdmin()) {
      return widgetsResponse;
    }

    const data: any[] = await this.contactService
      .getBusinessContacts();

    widgetsResponse.businessContacts = data;
    widgetsResponse.result = true;

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.INSTALL_WIDGET)
  public async onInstallWidget(
    client: SocketWithToken,
    payload: InstallWidgetPayloadInterface,
  ): Promise<InstallWidgetResponseInterface> {

    const widgetsResponse: InstallWidgetResponseInterface = {
      name: MessageNameEnum.INSTALL_WIDGET,
      result: false,
    };

    const business: BusinessModel =
      await this.businessService.findOneById(client.businessId) as unknown as BusinessModel;

    const widget: WidgetModel = await this.widgetService.findOneById(payload.widgetId);

    if (!business || !widget) {
      return widgetsResponse;
    }

    const installation: WidgetInstallationModel =
      await this.installationService.installToBusiness(widget, business);

    widgetsResponse.result = true;
    widgetsResponse.widgetData = {
      icon: installation.widget.icon,
      installed: installation.installed,
      order: installation.order,
      type: installation.widget.type,
    };

    return widgetsResponse;
  }

  @SubscribeMessage(MessageNameEnum.UNINSTALL_WIDGET)
  public async onUninstallWidget(
    client: SocketWithToken,
    payload: UninstallWidgetPayloadInterface,
  ): Promise<UninstallWidgetResponseInterface> {

    const widgetsResponse: UninstallWidgetResponseInterface = {
      name: MessageNameEnum.UNINSTALL_WIDGET,
      result: false,
    };

    const business: BusinessModel =
      await this.businessService.findOneById(client.businessId) as unknown as BusinessModel;

    const widget: WidgetModel = await this.widgetService.findOneById(payload.widgetId);

    if (!business || !widget || (widget && widget.default)) {
      return widgetsResponse;
    }

    const uninstallation: WidgetInstallationModel =
      await this.installationService.uninstall(widget, business);

    widgetsResponse.result = true;
    widgetsResponse.widgetData = {
      icon: uninstallation.widget.icon,
      installed: uninstallation.installed,
      order: uninstallation.order,
      type: uninstallation.widget.type,
    };

    return widgetsResponse;
  }

  private verifyToken(token: string): boolean {
    try {
      jwtVerify(token, environment.jwtOptions.secret);
    } catch (e) {
      return false;
    }

    return true;
  }

  private async verifyTokenAndExtractUserData(token: string): Promise<AccessTokenPayload> {
    let user: any;
    try {
      const jwtDecoded: any = TokenHelper.extractTokenString(token);
      user = await this.jwtService.getUser(jwtDecoded);
    } catch (e) { }

    return user && this.verifyToken(token) ? user : null;
  }
}
