import { isEqual } from 'lodash';
import { Schema, Document } from 'mongoose';

import { Schema as SchemaDecorator, Prop, SchemaFactory } from '@nestjs/mongoose';

import {
  ApplicationAccessInterface,
  UserRoleCustomer as UserRoleCustomerInterface,
  RolesEnum,
  ShopAccessInterface,
} from '@pe/nest-kit';

import { ApplicationAccess, ApplicationAccessDocument, ApplicationAccessSchema } from './application-access.schema';

@SchemaDecorator({
  _id: false,
})
export class CustomerRole implements UserRoleCustomerInterface {
  public readonly name: RolesEnum.customer;

  @Prop({ type: [Schema.Types.Mixed] })
  public shops: ShopAccessInterface[];

  @Prop({ type: [ApplicationAccessSchema] })
  public applications: ApplicationAccess[];
}

export interface CustomerRoleDocument extends CustomerRole, Document<string> {
  readonly applications: ApplicationAccessDocument[];
  addApplicationEntry: (shopEntry: ApplicationAccessInterface) => void;
  removeApplicationEntry: (applicationId: string) => void;
  hasApplicationEntry: (shopEntry: ApplicationAccessInterface) => boolean;
}

export const CustomerRoleSchema: Schema<CustomerRoleDocument> = SchemaFactory.createForClass(CustomerRole);

CustomerRoleSchema.method(
  'hasApplicationEntry',
  function (shopEntry: ApplicationAccessInterface): boolean {
    return this.applications.some((_shopEntry: ApplicationAccessInterface) => isEqual(shopEntry, _shopEntry));
  },
);

CustomerRoleSchema.method(
  'addApplicationEntry',
  function (shopEntry: ApplicationAccessInterface): void {
    if (!this.hasApplicationEntry(shopEntry)) {
      this.applications.push(shopEntry as ApplicationAccessDocument);
    }
  },
);

CustomerRoleSchema.method(
  'removeApplicationEntry',
  function (applicationId: string): void {
    const index: number =
      this.applications.findIndex((shop: ApplicationAccessInterface) => shop.applicationId === applicationId);
    if (index) {
      this.applications.splice(index, 1);
    }
  },
);
