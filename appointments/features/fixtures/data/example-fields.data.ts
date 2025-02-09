import { DocumentDefinition } from 'mongoose';

import { FieldDocument } from '../../../src/appointments/schemas';

export const exampleFieldsFixture: Array<DocumentDefinition<FieldDocument>> = [
  {
    _id: 'd9aab937-ad45-4815-9a4b-63f39ec12b53',
    name: 'firstName',
    title: 'First Name',
    type: 'text',
  },
  {
    _id: 'aea7b2c2-3551-4c13-9ec3-a3b663bd8696',
    name: 'lastName',
    title: 'Last Name',
    type: 'text',
  },
  {
    _id: '4f0883c5-782c-4aee-bc78-aa816b0a147c',
    name: 'email',
    title: 'email',
    type: 'text',
  },
  {
    _id: '31d87f2f-92ff-4fc5-9aa8-2a3b0bd01d94',
    name: 'imageUrl',
    title: 'Image',
    type: 'text',
  },
  {
    _id: 'f74d86a1-baba-49ab-9e6d-b54b443eec5a',
    name: 'mobilePhone',
    title: 'Mobile Phone',
    type: 'text',
  },
  {
    _id: '43b2e39b-b4a8-4a4a-8e17-6908aa9e7ce8',
    name: 'street',
    title: 'street',
    type: 'text',
  },
  {
    _id: 'abb9689c-2d5d-4cba-bbd5-4a50fd93057d',
    name: 'city',
    title: 'city',
    type: 'text',
  },
  {
    _id: '61b97dea-04a8-4b57-ba05-14cef537ec5a',
    name: 'state',
    title: 'state',
    type: 'text',
  },
  {
    _id: '5c4ac4a3-683a-49aa-bf8c-6795cfee8a5a',
    name: 'zip',
    title: 'zip',
    type: 'text',
  },
  {
    _id: '57f155d8-c343-48b2-b4a4-0011177b5d06',
    name: 'country',
    title: 'country',
    type: 'text',
  },
];
