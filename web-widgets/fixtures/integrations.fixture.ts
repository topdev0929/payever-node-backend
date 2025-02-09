import { RolesEnum } from '@pe/nest-kit';
import { WidgetActions } from '../src/proxy/enums';

const FINANCE_EXPRESS_HOST: string = '${MICRO_URL_FINANCE_EXPRESS}/api';

export const integrationsFixture: any[] = [
  {
    _id: '97f51a0d-9e17-4a27-9571-53b2baf6ac18',
    code: 'finance-express',
    url: FINANCE_EXPRESS_HOST,

    actions: [
      {
        _id: '62d40bed-de59-473b-b93c-066ab44af1a8',
        description: 'Get widgets',
        isClientAllowed: true,
        method: 'GET',
        name: WidgetActions.GetWidgets,
        roles: [RolesEnum.merchant],
        url: '/business/:businessId/widgets',
      },
      {
        _id: '4bd2ff46-49bf-11eb-b378-0242ac130002',
        description: 'Get widgets by Id',
        isClientAllowed: true,
        method: 'GET',
        name: WidgetActions.GetWidgetById,
        roles: [RolesEnum.anonymous, RolesEnum.user],
        url: '/business/:businessId/widgets/:widgetId',
      },
      {
        _id: '4f46ccde-49bf-11eb-b378-0242ac130002',
        description: 'Get widgets by type',
        method: 'GET',
        name: WidgetActions.GetWidgetsByType,
        roles: [RolesEnum.merchant],
        url: '/business/:businessId/widgets/type/:widgetType',
      },
      {
        _id: '53d6f580-49bf-11eb-b378-0242ac130002',
        description: 'Create widget',
        method: 'POST',
        name: WidgetActions.WidgetCreate,
        roles: [RolesEnum.merchant],
        url: '/business/:businessId/widget',
      },
      {
        _id: '5d3bc6e6-49bf-11eb-b378-0242ac130002',
        description: 'Update widget',
        method: 'PUT',
        name: WidgetActions.WidgetUpdate,
        roles: [RolesEnum.merchant],
        url: '/business/:businessId/widget/:widgetId',
      },
      {
        _id: '5fce73e0-49bf-11eb-b378-0242ac130002',
        description: 'Delete widget',
        method: 'DELETE',
        name: WidgetActions.WidgetDelete,
        roles: [RolesEnum.merchant],
        url: '/business/:businessId/widget/:widgetId',
      },
      {
        _id: '6b6b3b69-37e0-4e87-b570-c0ff7756c201',
        description: 'Calculate rates',
        isClientAllowed: true,
        method: 'POST',
        name: WidgetActions.CalculateRates,
        roles: [RolesEnum.anonymous, RolesEnum.guest],
        url: '/business/:businessId/calculate-rates',
      },
      {
        _id: 'b5a13b13-824a-4b9b-9e76-05821f8bda35',
        description: 'Calculate rates',
        isClientAllowed: true,
        method: 'POST',
        name: WidgetActions.Rates,
        roles: [RolesEnum.anonymous, RolesEnum.guest],
        url: '/business/:businessId/rates',
      },
      {
        _id: '3ef3ec1d-03b7-4a16-a4ca-4871d9fe775e',
        description: 'Supported payment options',
        isClientAllowed: true,
        method: 'GET',
        name: WidgetActions.SupportedPaymentOptions,
        roles: [RolesEnum.anonymous, RolesEnum.guest],
        url: '/supported-payment-options',
      },
    ],
  },
];
