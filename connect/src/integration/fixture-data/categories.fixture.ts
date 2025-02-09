import { Folder } from '@pe/folders-plugin';
import { CategoryInterface } from '../interfaces';

export interface CategoryPrototype extends
  CategoryInterface,
  Pick<Folder, 'position' | 'image'>
{
  _id: string;

  category: string;
}

export const CategoriesFixture: CategoryPrototype[] = [
  {
    _id: '2e436e63-fa0a-414a-b1c3-020044d5eba5',
    category: 'payments',
    image: 'payments-icon-filter.svg',
    name: 'integrations.categories.payments',
    position: 1,
  },
  {
    _id: '848e244b-6872-4685-8bad-4e4f5c16f979',
    category: 'shippings',
    image: 'shipping-icon-filter.svg',
    name: 'integrations.categories.shippings',
    position: 2,
  },
  {
    _id: 'dd0c6f67-0250-4907-8321-6d42b29f09ec',
    category: 'shopsystems',
    image: 'shopsystem-icon-filter.svg',
    name: 'integrations.categories.shopsystems',
    position: 4,
  },
  {
    _id: '540874fa-29cf-47a5-b1e8-28ce8aa71891',
    category: 'products',
    image: 'products-icon-filter.svg',
    name: 'integrations.categories.products',
    position: 5,
  },
  {
    _id: 'b48d25e5-749b-4804-950c-da2d5b4d94ba',
    category: 'communications',
    image: 'communication-icon-filter.svg',
    name: 'integrations.categories.communications',
    position: 6,
  },
  {
    _id: 'd67adee3-5eef-4a83-abab-4c2047c62f7f',
    category: 'messaging',
    image: 'messaging-icon-filter.svg',
    name: 'integrations.categories.messaging',
    position: 7,
  },
  {
    _id: 'd67adee3-5eef-4a83-abab-4c2047c32f7f',
    category: 'social',
    image: 'social-icon-filter.svg',
    name: 'integrations.categories.social',
    position: 8,
  },
  {
    _id: '928c089b-d340-43a7-9484-9f48026c1f01',
    category: 'design',
    image: 'design-icon-filter.svg',
    name: 'integrations.categories.design',
    position: 9,
  },
  {
    _id: 'd67adee3-5eef-4a83-abab-4c2047c32d4d',
    category: 'accountings',
    image: 'social-icon-filter.svg',
    name: 'integrations.categories.accountings',
    position: 8,
  },
];

