import { IntegrationServiceInterface, PackageTypeInterface } from '../src/integration';

export const upsIntegrationServices: IntegrationServiceInterface[] = [
  {
    displayName: 'shipping.integration.service.ups.next_day_air',
    code: '01',
  },
  {
    displayName: 'shipping.integration.service.ups.ups_2nd_day_air',
    code: '02',
  },
  {
    displayName: 'shipping.integration.service.ups.ground',
    code: '03',
  },
  {
    displayName: 'shipping.integration.service.ups.express',
    code: '07',
  },
  {
    displayName: 'shipping.integration.service.ups.expedited',
    code: '08',
  },
  {
    displayName: 'shipping.integration.service.ups.ups_standard',
    code: '11',
  },
  {
    displayName: 'shipping.integration.service.ups.ups_3_day_select',
    code: '12',
  },
  {
    displayName: 'shipping.integration.service.ups.next_day_air_saver',
    code: '13',
  },
  {
    displayName: 'shipping.integration.service.ups.ups_next_day_air_early',
    code: '14',
  },
  {
    displayName: 'shipping.integration.service.ups.express_plus',
    code: '54',
  },
  {
    displayName: 'shipping.integration.service.ups.ups_2nd_day_air_am',
    code: '59',
  },
  {
    displayName: 'shipping.integration.service.ups.ups_saver',
    code: '65',
  },
  {
    displayName: 'shipping.integration.service.ups.ups_access_point_tm_economy',
    code: '70',
  },
  {
    displayName: 'shipping.integration.service.ups.first_class_mail',
    code: 'M2',
  },
  {
    displayName: 'shipping.integration.service.ups.priority_mail',
    code: 'M3',
  },
  {
    displayName: 'shipping.integration.service.ups.expedited_maii_innovations',
    code: 'M4',
  },
  {
    displayName: 'shipping.integration.service.ups.priority_mail_innovations',
    code: 'M5',
  },
  {
    displayName: 'shipping.integration.service.ups.economy_mail_innovations',
    code: 'M6',
  },
  {
    displayName: 'shipping.integration.service.ups.maii_innovations_mi_returns',
    code: '17',
  },
  {
    displayName: 'shipping.integration.service.ups.ups_access_point_economy',
    code: '70',
  },
  {
    displayName:
      'shipping.integration.service.ups.ups_worldwide_express_freight_midday',
    code: '71',
  },
  {
    displayName: 'shipping.integration.service.ups.ups_express_12_00',
    code: '74',
  },
  {
    displayName: 'shipping.integration.service.ups.ups_heavy_goods',
    code: '75',
  },
  {
    displayName: 'shipping.integration.service.ups.ups_today_standard',
    code: '82',
  },
  {
    displayName: 'shipping.integration.service.ups.ups_today_dedicated_courier',
    code: '83',
  },
  {
    displayName: 'shipping.integration.service.ups.ups_today_intercity',
    code: '84',
  },
  {
    displayName: 'shipping.integration.service.ups.ups_today_express',
    code: '85',
  },
  {
    displayName: 'shipping.integration.service.ups.ups_today_express_saver',
    code: '86',
  },
  {
    displayName:
      'shipping.integration.service.ups.ups_worldwide_express_freight',
    code: '96',
  },
];

export const upsPackageType: PackageTypeInterface[] = [
  {
    code: '01',
    displayName: 'shipping.integration.packages.ups.ups_letter',
  },
  {
    code: '02',
    displayName: 'shipping.integration.packages.ups.customer_supplied_package',
  },
  {
    code: '03',
    displayName: 'shipping.integration.packages.ups.tube',
  },
  {
    code: '04',
    displayName: 'shipping.integration.packages.ups.pak',
  },
  {
    code: '21',
    displayName: 'shipping.integration.packages.ups.ups_express_box',
  },
  {
    code: '24',
    displayName: 'shipping.integration.packages.ups.ups_25kg_box',
  },
  {
    code: '25',
    displayName: 'shipping.integration.packages.ups.ups_10kg_box',
  },
  {
    code: '30',
    displayName: 'shipping.integration.packages.ups.pallet',
  },
  {
    code: '2a',
    displayName: 'shipping.integration.packages.ups.small_express_box',
  },
  {
    code: '2b',
    displayName: 'shipping.integration.packages.ups.medium_express_box',
  },
  {
    code: '2c',
    displayName: 'shipping.integration.packages.ups.large_express_box',
  },
  {
    code: '56',
    displayName: 'shipping.integration.packages.ups.flats',
  },
  {
    code: '57',
    displayName: 'shipping.integration.packages.ups.parcels',
  },
  {
    code: '58',
    displayName: 'shipping.integration.packages.ups.bpm',
  },
  {
    code: '59',
    displayName: 'shipping.integration.packages.ups.first_class',
  },
  {
    code: '60',
    displayName: 'shipping.integration.packages.ups.priority',
  },
  {
    code: '61',
    displayName: 'shipping.integration.packages.ups.machinables',
  },
  {
    code: '62',
    displayName: 'shipping.integration.packages.ups.irregulars',
  },
  {
    code: '63',
    displayName: 'shipping.integration.packages.ups.parcel_post',
  },
  {
    code: '64',
    displayName: 'shipping.integration.packages.ups.bpm_parcel',
  },
  {
    code: '65',
    displayName: 'shipping.integration.packages.ups.media_mail',
  },
  {
    code: '66',
    displayName: 'shipping.integration.packages.ups.bpm_flat',
  },
  {
    code: '67',
    displayName: 'shipping.integration.packages.ups.standard_flat',
  },
];
