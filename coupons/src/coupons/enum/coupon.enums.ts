export enum CouponTypeEnum {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE_SHIPPING = 'FREE_SHIPPING',
  BUY_X_GET_Y = 'BUY_X_GET_Y',
}

export enum CouponsStatusEnum {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
}

export enum CouponTypeAppliedToEnum {
  ALL_PRODUCTS = 'ALL_PRODUCTS',
  SPECIFIC_CATEGORIES = 'SPECIFIC_CATEGORIES',
  SPECIFIC_PRODUCTS = 'SPECIFIC_PRODUCTS',
}

export enum CouponTypeFreeShippingTypeEnum {
  ALL_COUNTRIES = 'ALL_COUNTRIES',
  SELECTED_COUNTRIES = 'SELECTED_COUNTRIES',
}

export enum CouponTypeBuyXGetYBuyRequirementsTypeEnum {
  MINIMUM_QUANTITY_OF_ITEMS = 'MINIMUM_QUANTITY_OF_ITEMS',
  MINIMUM_PURCHASE_AMOUNT = 'MINIMUM_PURCHASE_AMOUNT',
}
export enum CouponTypeBuyXGetYGetDiscountTypesEnum {
  PERCENTAGE = 'PERCENTAGE',
  FREE = 'FREE',
}

export enum CouponTypeBuyOrGetXGetYItemTypeEnum {
  SPECIFIC_CATEGORIES = 'SPECIFIC_CATEGORIES',
  SPECIFIC_PRODUCTS = 'SPECIFIC_PRODUCTS',
}

export enum CouponTypeMinimumRequirementsEnum {
  NONE = 'NONE',
  MINIMUM_QUANTITY_OF_ITEMS = 'MINIMUM_QUANTITY_OF_ITEMS',
  MINIMUM_PURCHASE_AMOUNT = 'MINIMUM_PURCHASE_AMOUNT',
}

export enum CouponTypeCustomerEligibilityEnum {
  EVERYONE = 'EVERYONE',
  SPECIFIC_GROUPS_OF_CUSTOMERS = 'SPECIFIC_GROUPS_OF_CUSTOMERS',
  SPECIFIC_CUSTOMERS = 'SPECIFIC_CUSTOMERS',
}

export enum CouponEventNamesEnum {
  CREATED = 'coupons.event.code.created',
  UPDATED = 'coupons.event.code.updated',
  DELETED = 'coupons.event.code.deleted',
  EXPORTED = 'coupons.event.code.exported',
}

export enum RabbitExchangesEnum {
  asyncEvents = 'async_events',
  rpcCalls = 'rpc_calls',
  couponsFolders = 'coupons_folders',
  couponsExport = 'coupons_export',
}

export enum RabbitEventNamesEnum {
  ProductsEsSearch = 'products.rpc.folder-plugin.readonly.es.search',
  ContactsEsSearch = 'products.rpc.folder-plugin.readonly.es.search',
}

export enum RabbitChannelsEnum {
  Coupons = 'async_events_coupons_micro',
  CouponsFolders = 'async_events_coupons_folders_micro',
  CouponsExport = 'async_events_coupons_export_micro',
}

