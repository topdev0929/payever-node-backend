import { fixture } from '@pe/cucumber-sdk';

import { albumFactory } from '../../factories/album.factory';
import { AlbumModel } from '../../../../src/album/models';

const albumId1: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const albumId2: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1';
const businessId: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

export = fixture<AlbumModel>('AlbumModel', albumFactory, [
  {
    _id: albumId1,
    businessId: businessId,
    name: `Album 1`,
  },
  {
    _id: albumId2,
    businessId: businessId,
    name: `Album to find by name`,
    parent: albumId1,
  },
  {
    name: `Other business album`,
  },
]);
