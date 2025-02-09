// tslint:disable-next-line: no-commented-code
// tslint:disable: typedef
// tslint:disable: object-literal-sort-keys
import { DimensionEnum, SizeValueEnum, WidgetTypeEnum } from '../src/statistics';

export const dimensionsFixture = [{
  _id: 'b7b41606-67fe-4650-8508-8382e7964c73',
  name: DimensionEnum.Browser,
  types: [WidgetTypeEnum.Checkout],
  sizes: [SizeValueEnum.Small, SizeValueEnum.Medium, SizeValueEnum.Large],
}, {
  _id: 'f50661b6-b4bd-451b-9473-094e8f52c15c',
  name: DimensionEnum.BusinessId,
  types: [WidgetTypeEnum.Transactions, WidgetTypeEnum.Checkout,
     WidgetTypeEnum.Shop, WidgetTypeEnum.Site, WidgetTypeEnum.Pos, WidgetTypeEnum.Subscriptions, WidgetTypeEnum.Blog],
  sizes: [SizeValueEnum.Small, SizeValueEnum.Medium, SizeValueEnum.Large],
}, {
  _id: '73ff02c4-4959-4d02-8f50-0f747cda740b',
  name: DimensionEnum.Channel,
  types: [WidgetTypeEnum.Transactions, WidgetTypeEnum.Checkout],
  sizes: [SizeValueEnum.Small, SizeValueEnum.Medium, SizeValueEnum.Large],
}, {
  _id: 'c374943b-bf62-43b6-99d6-f6dc8c5ebb26',
  name: DimensionEnum.Country,
  types: [WidgetTypeEnum.Transactions, WidgetTypeEnum.Checkout],
  sizes: [SizeValueEnum.Small, SizeValueEnum.Medium, SizeValueEnum.Large],
}, {
  _id: '7a395867-d5b9-4e0b-8d10-f1a9b0c41757',
  name: DimensionEnum.CreatedAt,
  types: [WidgetTypeEnum.Transactions, WidgetTypeEnum.Checkout,
     WidgetTypeEnum.Shop, WidgetTypeEnum.Site,
      WidgetTypeEnum.Pos, WidgetTypeEnum.Subscriptions, WidgetTypeEnum.Marketing, WidgetTypeEnum.Blog],
  sizes: [SizeValueEnum.Small, SizeValueEnum.Medium, SizeValueEnum.Large],
}, {
  _id: 'ed5de5a2-8a83-4d5b-ab2d-3c385c1798fc',
  name: DimensionEnum.Currency,
  types: [WidgetTypeEnum.Transactions, WidgetTypeEnum.Checkout],
  sizes: [SizeValueEnum.Small, SizeValueEnum.Medium, SizeValueEnum.Large],
}, {
  _id: 'd4631c33-3a7b-4aa2-bd22-9abfb6750523',
  name: DimensionEnum.Device,
  types: [WidgetTypeEnum.Checkout],
  sizes: [SizeValueEnum.Small, SizeValueEnum.Medium, SizeValueEnum.Large],
}, {
  _id: '8faa9fea-fcbd-4092-8285-a6a8bd14e3d7',
  name: DimensionEnum.PaymentMethod,
  types: [WidgetTypeEnum.Transactions, WidgetTypeEnum.Checkout],
  sizes: [SizeValueEnum.Small, SizeValueEnum.Medium, SizeValueEnum.Large],
}, {
  _id: '8faa9fea-fcbd-4092-8285-a6a8bd14e3d0',
  name: DimensionEnum.Url,
  types: [WidgetTypeEnum.Shop, WidgetTypeEnum.Site, 
    WidgetTypeEnum.Pos, WidgetTypeEnum.Subscriptions, WidgetTypeEnum.Marketing, WidgetTypeEnum.Blog],
  sizes: [SizeValueEnum.Small, SizeValueEnum.Medium, SizeValueEnum.Large],
}, {
  _id: '8faa9fea-fcbd-4092-8285-a6a8bd14e3d1',
  name: DimensionEnum.ApplicationId,
  types: [WidgetTypeEnum.Shop, WidgetTypeEnum.Site, 
    WidgetTypeEnum.Pos, WidgetTypeEnum.Subscriptions, WidgetTypeEnum.Marketing, WidgetTypeEnum.Blog],
  sizes: [SizeValueEnum.Small, SizeValueEnum.Medium, SizeValueEnum.Large],
},
{
  _id: '8faa9fea-fcbd-4092-8285-a6a8bd14e3d2',
  name: DimensionEnum.Element,
  types: [WidgetTypeEnum.Shop, WidgetTypeEnum.Site,
     WidgetTypeEnum.Pos, WidgetTypeEnum.Subscriptions, WidgetTypeEnum.Marketing, WidgetTypeEnum.Blog],
  sizes: [SizeValueEnum.Small, SizeValueEnum.Medium, SizeValueEnum.Large],
},
];
