import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AclInterface,
  Encryption,
  PermissionInterface,
  RolesEnum,
  UserRoleInterface,
  UserRoleMerchant,
  UserTokenInterface,
} from '@pe/nest-kit';
import { BusinessModel } from '@pe/business-kit';
import { ElasticHelper, ElasticSearchClient } from '@pe/elastic-kit';

import { SearchDto, SearchResultDto } from '../dto';
import { OwnerInterface, SpotlightInterface } from '../interfaces';
import { AppModel, SpotlightModel } from '../models';
import { AppSchemaName, SpotlightSchemaName } from '../schemas';
import { BillingSubscriptionService } from './billing-subscription.service';
import { BlogService } from './blog.service';
import { CheckoutService } from './checkout.service';
import { ContactService } from './contact.service';
import { DashboardService } from './dashboard.service';
import { IntegrationService } from './integration.service';
import { InvoiceService } from './invoice.service';
import { MessageService } from './message.service';
import { ProductService } from './product.service';
import { ShippingOrderService } from './shipping-order.service';
import { ShopService } from './shop.service';
import { SiteService } from './site.service';
import { TerminalService } from './terminal.service';
import { TransactionService } from './transaction.service';
import { UserService } from './user.service';
import { ElasticDocumentIndexService } from './elastic-document-index.service';
import { AppEnum, TransactionsIconEnum } from '../enums';

export const ADMIN_API_BUSINESS_ID: string = 'admin-api';
const SPOTLIGHT_INDEX = 'spotlight';
const CONNECT_FOLDER_INDEX = 'connect-folder';
@Injectable()
export class SpotlightService {
  constructor(
    private readonly billingSubscriptionService: BillingSubscriptionService,
    private readonly blogService: BlogService,
    private readonly checkoutService: CheckoutService,
    private readonly contactService: ContactService,
    private readonly dashboardService: DashboardService,
    private readonly integrationService: IntegrationService,
    private readonly invoiceService: InvoiceService,
    private readonly messageService: MessageService,
    private readonly productService: ProductService,
    private readonly shippingOrderService: ShippingOrderService,
    private readonly shopService: ShopService,
    private readonly siteService: SiteService,
    private readonly terminalService: TerminalService,
    private readonly transactionService: TransactionService,
    private readonly userService: UserService,
    @InjectModel(SpotlightSchemaName) private readonly spotlightModel: Model<SpotlightModel>,
    @InjectModel(AppSchemaName) private readonly appModel: Model<AppModel>,
    private readonly elasticDocumentIndexService: ElasticDocumentIndexService,
    protected readonly elasticSearchClient: ElasticSearchClient,
  ) {
  }

  public async legacySearch(
    dto: SearchDto,
    business: BusinessModel,
    user: UserTokenInterface,
  ): Promise<any> {
    const result: any[] = await Promise.all([
      this.billingSubscriptionService.search(dto, business, user),
      this.blogService.search(dto, business, user),
      this.checkoutService.search(dto, business, user),
      this.contactService.search(dto, business, user),
      this.dashboardService.search(dto, business, user),
      this.integrationService.search(dto, business, user),
      this.invoiceService.search(dto, business, user),
      this.messageService.search(dto, business, user),
      this.productService.search(dto, business, user),
      this.shippingOrderService.search(dto, business, user),
      this.shopService.search(dto, business, user),
      this.siteService.search(dto, business, user),
      this.terminalService.search(dto, business, user),
      this.transactionService.search(dto, business, user),
      this.userService.search(dto, business, user),
    ]);

    return {
      billingSubscriptions: result[0],
      blogs: result[1],
      checkouts: result[2],
      contacts: result[3],
      dashboards: result[4],
      integrations: result[5],
      invoices: result[6],
      messages: result[7],
      products: result[8],
      shippingOrders: result[9],
      shops: result[10],
      sites: result[11],
      terminals: result[12],
      transactions: result[13],
      users: result[14],
    };
  }

  public async search(
    dto: SearchDto,
    business: BusinessModel,
    user: UserTokenInterface,
  ): Promise<any> {
    dto.query = dto.query.trim();
    const isAdmin: boolean = this.isAdmin(user);
    const apps: AppEnum[] = isAdmin
      ? [AppEnum.Users, AppEnum.Businesses, AppEnum.Transactions, AppEnum.Checkout, AppEnum.Pos]
      : this.getAppsWithReadPermission(user.roles, business._id);

    const result: any = await this.selectIdentifiersByFilter(dto, apps, business, user);

    const suggestedApps: AppModel[] = await this.appModel.find(
      {
        $or: [
          { description: { $regex: new RegExp(this.escapeRegex(dto.query) , 'i') } },
        ],
      },
    );

    return {
      ...result,
      suggestedApps: suggestedApps,
    };
  }

  public async createOrUpdate(dto: SpotlightInterface, id: string, index: boolean = true): Promise<SpotlightModel> {

    const spotlight: SpotlightModel = await this.spotlightModel.findOneAndUpdate({
      _id: id,
    }, {
      $set: dto,
    }, {
      new: true,
      upsert: true,
    }).exec();

    if (index) {
      await this.elasticDocumentIndexService.updateDocumentIndex(spotlight.toObject());
    }

    return spotlight;
  }

  public async deleteAppData(app: AppEnum): Promise<void> {
    await this.spotlightModel.deleteMany({ app });
    const query: any =
    {
      query: {
        match_phrase: {
          app,
        },
      },
    };
    await this.elasticSearchClient.deleteByQuery(
      SPOTLIGHT_INDEX,
      query,
    );
  }

  public async delete(id: string): Promise<void> {
    await this.spotlightModel.deleteOne({ _id: id });
    await this.elasticDocumentIndexService.deleteDocumentIndexById(id);
  }

  public async getOwner(owner: string): Promise<OwnerInterface> {
    const userSpotlightDocument: SpotlightModel = await this.spotlightModel.findOne({
      _id: owner,
      app: AppEnum.Users,
    });

    return {
      email: userSpotlightDocument?.description,
      fullName: userSpotlightDocument?.title,
      userId: owner,
    };
  }

  private async selectIdentifiersByFilter(
    dto: SearchDto,
    apps: string[],
    business: BusinessModel,
    user: UserTokenInterface,
  ): Promise<SearchResultDto> {

    if (apps.length === 0) {
      return {
        result: [],
        total: 0,
      };
    }

    const elasticFilters: any = this.createFiltersBody();
    const isAdmin: boolean = this.isAdmin(user);

    const normalUserScope: any = {
      bool: {
        should: [
          {
            bool: {
              must: [
                {
                  match_phrase: {
                    app: AppEnum.Businesses,
                  },
                },
                {
                  match_phrase: {
                    ownerId: user.id,
                  },
                },
              ],
            },
          },
          {
            bool: {
              must: [
                {
                  bool: {
                    must_not: [
                      {
                        match_phrase: {
                          app: AppEnum.Businesses,
                        },
                      },
                    ],
                  },
                },
                {
                  match_phrase: {
                    businessId: business?._id,
                  },
                },
              ],
            },
          },
          {
            bool: {
              must: [
                {
                  match_phrase: {
                    businessId: business?._id,
                  },
                },
                {
                  term: {
                    scope: 'business',
                  },
                },
              ],
            },
          },
          {
            term: {
              scope: 'default',
            },
          },
        ],
      },
    };

    const adminScope: any = {
      bool: {
        should: [
          {
            bool: {
              must: [
                {
                  match_phrase: {
                    app: AppEnum.Contact,
                  },
                },
                {
                  match_phrase: {
                    businessId: ADMIN_API_BUSINESS_ID,
                  },
                },
              ],
            },
          },
          {
            bool: {
              must: [
                {
                  bool: {
                    must_not: [
                      {
                        match_phrase: {
                          app: AppEnum.Contact,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    };

    elasticFilters.must.push(isAdmin ? adminScope : normalUserScope);

    this.addSearchFilters(elasticFilters, dto.query, apps);

    const body: any = {
      from: 0,
      query: {
        bool: elasticFilters,
      },
      size: apps.length * 10,
    };

    const searchResult: SearchResultDto = await this.searchCustom(body, SPOTLIGHT_INDEX);

    if (apps.includes(AppEnum.Connect)) {
      const searchConnectAppResult: SearchResultDto = await this.searchCustom(body, CONNECT_FOLDER_INDEX);

      searchConnectAppResult.result = searchConnectAppResult.result.map(result => {
        if (result.category) {
          return {
            businessId: result.businessId,
            contact: [],
            __v: 0,
            app: AppEnum.Connect,
            description: result.category,
            icon: null,
            serviceEntityId: result.serviceEntityId,
            title: result.name,
            _id: result._id,
          };
        }

        return result;
      });

      if (searchConnectAppResult.result.length > 0) {
        if (searchResult.result.length > 0) {
          searchResult.result = [...searchResult.result, ...searchConnectAppResult.result];
          searchResult.total.value = searchResult.total.value + searchConnectAppResult.total.value;
        } else {
          searchResult.result = [...searchConnectAppResult.result];
          searchResult.total = searchConnectAppResult.total;
        }
      }
    }


    await Promise.all(searchResult.result.map((result: any) => {
      if (result.app === AppEnum.Message) {
        return this.decryptMessage(result, isAdmin);
      }
      if (result.app === AppEnum.Transactions) {
        result.icon = TransactionsIconEnum[result.icon];
        result.title = `# ${result.title}`;
      }
    }));

    const ids: string[] = searchResult.result.map((data: any) => data.serviceEntityId);
    searchResult.result = searchResult.result.filter(
      (data: any, index: number) => !ids.includes(data.serviceEntityId, index + 1)
    );

    return searchResult;
  }

  private async searchCustom(body: any, index: string): Promise<SearchResultDto> {
    const result: SearchResultDto = await this.elasticSearchClient.search(
      index,
      body,
    ).then((results: any) => {
      return results?.body?.hits?.hits?.length > 0 && results?.body?.hits?.total?.value > 0
        ? {
          result: results.body.hits.hits.map(
            (elem: any) => {
              elem._source._id = elem._source.mongoId;
              delete elem._source.mongoId;

              return elem._source;
            },
          ),
          total: results.body.hits.total,
        } : {
          result: [],
          total: 0,
        };
    })
      .catch(() => {
        return {
          result: [],
          total: 0,
        };
      });

    return result;
  }

  private async decryptMessage(message: any, isAdmin: boolean): Promise<any> {
    const newMessage: any = {
      ...message,
      description: message.description && !isAdmin ?
        await Encryption.decryptWithSalt(message.description, message.salt) : null,
    };

    delete newMessage.salt;

    return newMessage;
  }


  private addSearchFilters(filters: any, search: string, apps: string[]): void {
    filters.must.push(
      {
        query_string: {
          default_operator: 'AND',
          fields: [
            'title^1',
            'description^1',
            'serviceEntityId^1',
            'titleTranslations.en^1',
            'titleTranslations.de^1',
            'titleTranslations.da^1',
            'titleTranslations.es^1',
            'titleTranslations.no^1',
            'titleTranslations.sv^1',
            'category^1',
            'owner.email',
          ],
          query: ElasticHelper.generateQueryString(search),
        },
      },
    );

    let allApps: string[] = [...apps];
    if (apps.includes('connect')) {
      allApps = [...allApps, 'social', 'payments', 'shippings', 'shopsystems', 'messaging', 'communications', 'integrations', 'products'];
    }

    filters.must.push(
      {
        query_string: {
          fields: ['app', 'category'],
          query: allApps.map((app: string) => `(${app})`).join(' OR '),
        },
      },
    );
  }

  private applyBusiness(
    field: string,
    businessId: string,
    filters: any = {},
  ): any {
    const phrase: any = {};
    phrase[field] = `${businessId}`;

    filters.must.push({
      match_phrase: phrase,
    });

    return filters;
  }

  private applyUser(
    filters: any = {},
    user: UserTokenInterface,
  ): any {

    filters.must.push(
      {
        query_string: {
          fields: [
            'ownerId^1',
          ],
          query: `${user.id}`,
        },
      },
    );


    return filters;
  }

  private createFiltersBody(): { must: any[]; must_not: any[]; filter: any[] } {
    return {
      filter: [],
      must: [],
      must_not: [
        {
          term: {
            title: '',
          },
        },
      ],
    };
  }

  private isAdmin(user: UserTokenInterface): boolean {
    return user.roles.findIndex((role: UserRoleInterface) => role.name === RolesEnum.admin) !== -1;
  }

  private getAppsWithReadPermission(roles: UserRoleInterface[], businessId: string): AppEnum[] {
    const apps: any[] = [];

    const merchantRole: UserRoleMerchant = roles.find(
      (role: UserRoleInterface) => role.name === RolesEnum.merchant,
    ) as any;

    const permissions: PermissionInterface = merchantRole.permissions.find((permission: PermissionInterface) => {
      return permission.businessId === businessId;
    });

    permissions.acls.forEach((acl: AclInterface) => {
      if (acl.read) {
        const appsAcls: AppEnum[] = this.getAppName(acl.microservice);
        if (appsAcls) {
          apps.push(...appsAcls.filter((app) => app !== undefined));
        }
      }
    });

    return apps.flat();
  }

  private getAppName(microservice: string): AppEnum[] {
    const apps: AppEnum[] = Object.values(AppEnum);

    for (const app of apps) {
      if (this.isMatch(app, microservice) && app === AppEnum.Users) {
        return [AppEnum.Users, AppEnum.Businesses];
      } else if (this.isMatch(app, microservice)) {
        return [app];
      }
    }
  }

  private isMatch(app: string, microservice: string): boolean {
    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (app === microservice || app + 's' === microservice) {
      return true;
    }

    return false;
  }

  private escapeRegex(str: string) {
    return str.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
  }
}
