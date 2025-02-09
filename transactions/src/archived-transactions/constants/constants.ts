import * as moment from 'moment';

export const STORE_FIELDS: string[] = [
  '_id',
  'uuid',
  'total',
  'type',
];

export const ANONYMIZED_TABLE_FIELDS: string[] = [
  'customer_name',
  'customer_email',
  'seller_name',
  'seller_email',
];

export const ANONYMIZED_DETAILS_FIELDS: string[] = [
  'customer.name',
  'customer.email',
  'billing_address.city',
  'billing_address.country',
  'billing_address.country_name',
  'billing_address.email',
  'billing_address.first_name',
  'billing_address.last_name',
  'billing_address.phone',
  'billing_address.salutation',
  'billing_address.street',
  'billing_address.zip_code',
  'shipping.address.city',
  'shipping.address.country',
  'shipping.address.country_name',
  'shipping.address.email',
  'shipping.address.first_name',
  'shipping.address.last_name',
  'shipping.address.phone',
  'shipping.address.salutation',
  'shipping.address.street',
  'shipping.address.zip_code',
  'details',
];

export const GDPR_REMOVE_ARCHIVED_TRANSACTION_AFTER: string = moment.duration(5, 'years').toISOString();

export const ANONYMIZED_TRANSACTION_FIELD: string = 'HIDDEN';

export const ARCHIVE_TRANSACTIONS_SALT: string = '2sXGOktOob7P50fOyzzYtyykEl0';

export const FILE_COLUMNS: any[] = [
  { 'name': 'created_at', 'title': 'Date'},
  { 'name': 'customer_email', 'title': 'Customer Email'},
  { 'name': 'customer_name', 'title': 'Customer Name'},
  { 'name': 'merchant_email', 'title': 'Merchant Email'},
  { 'name': 'merchant_name', 'title': 'Merchant Name'},
  { 'name': 'specific_status', 'title': 'Specific Status'},
  { 'name': 'status', 'title': 'Status'},
  { 'name': 'type', 'title': 'Payment Type'},
  { 'name': 'channel', 'title': 'Channel'},
  { 'name': 'total', 'title': 'Total'},
  { 'name': 'original_id', 'title': 'Payment Id'},
  { 'name': 'reference', 'title': 'Reference'},
  { 'name': 'seller_email', 'title': 'Seller Email'},
  { 'name': 'seller_name', 'title': 'Seller name'},
  { 'name': 'seller_id', 'title': 'Seller id'},
];
