import { dhlIntegrationServices } from "./dhl-integration.fixture";
import { upsIntegrationServices, upsPackageType } from "./ups-integration.fixture";

export const integrationsFixture = [{
    _id: '46dff89b-6190-4e55-bdc4-fa1888bda518',
    name: 'dhl',
    category: 'shippings',
    integrationServices: dhlIntegrationServices,
    displayOptions: {
      _id: 'fb72e27f-1e88-49d1-b5ee-c3d32a42e0f7',
      icon: '#icon-shipping-dhl-16-colorless',
      title: 'shipping.dhl.title',
    },
    createdAt: new Date('2019-02-11T09:30:00.340+0000'),
    updatedAt: new Date('2019-02-11T09:30:00.340+0000'),
    __v: 1,
  },
  {
    _id: '68f2d990-d9f5-43be-8b52-2f795a42bc8c',
    name: 'hermes',
    category: 'shippings',
    displayOptions: {
      _id: 'deb266b8-b105-4f6e-99a1-bb98b62e0d93',
      icon: '#icon-shipping-hermes-white',
      title: 'shipping.hermes.title',
    },
    createdAt: new Date('2019-02-11T09:30:00.340Z'),
    updatedAt: new Date('2019-02-11T09:30:00.340Z'),
    __v: 1,
  },
  {
    _id: 'c6e85624-0bb9-4589-8f39-8b28472fb5f8',
    name: 'ups',
    category: 'shippings',
    integrationServices: upsIntegrationServices,
    packageTypes: upsPackageType,
    displayOptions: {
      _id: '18c22eac-05a2-4520-ac10-4ea71e04e249',
      icon: '#icon-shipping-ups-white-16',
      title: 'shipping.ups.title',
    },
    createdAt: new Date('2019-02-11T09:30:00.340Z'),
    updatedAt: new Date('2019-02-11T09:30:00.340Z'),
    __v: 1,
  },
  {
    _id: '006a70b6-a178-11e9-ae52-332822bea546',
    name: 'custom',
    category: 'shippings',
    displayOptions: {
      _id: 'fb72e27f-1e88-49d1-b5ee-c3d32a42e0f7',
      icon: '#iicon-commerceos-shipping-16-colored',
      title: 'shipping.custom.title',
    },
    createdAt: new Date('2019-02-11T09:30:00.340Z'),
    updatedAt: new Date('2019-02-11T09:30:00.340Z'),
    __v: 0,
  },
];