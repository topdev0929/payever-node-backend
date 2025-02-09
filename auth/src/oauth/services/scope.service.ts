// tslint:disable: object-literal-sort-keys
import { Injectable } from '@nestjs/common';

import { AclInterface } from '@pe/nest-kit';
import { ScopesEnum } from '../../common';

@Injectable()
export class ScopeService {
  public createAcls(scopes: ScopesEnum[]): AclInterface[] {
    const acls: AclInterface[] = [];

    const services: any[] = [
      {
        microservice: 'appointments',
        scopes: [ScopesEnum.ReadContacts, ScopesEnum.WriteContacts],
        read: [ScopesEnum.ReadContacts, ScopesEnum.WriteContacts],
        create: [ScopesEnum.WriteContacts],
        update: [ScopesEnum.WriteContacts],
        delete: [ScopesEnum.WriteContacts],
      },
      {
        microservice: 'blog',
        scopes: [ScopesEnum.ReadBlog, ScopesEnum.WriteBlog],
        read: [ScopesEnum.ReadBlog, ScopesEnum.WriteBlog],
        create: [ScopesEnum.WriteBlog],
        update: [ScopesEnum.WriteBlog],
        delete: [ScopesEnum.WriteBlog],
      },
      {
        microservice: 'checkout',
        scopes: [ScopesEnum.ReadCheckout, ScopesEnum.WriteCheckout],
        read: [ScopesEnum.ReadCheckout, ScopesEnum.WriteCheckout],
        create: [ScopesEnum.WriteCheckout],
        update: [ScopesEnum.WriteCheckout],
        delete: [ScopesEnum.WriteCheckout],
      },
      {
        microservice: 'commerceos',
        scopes: [ScopesEnum.ReadCommerceOS, ScopesEnum.WriteCommerceOS],
        read: [ScopesEnum.ReadCommerceOS, ScopesEnum.WriteCommerceOS],
        create: [ScopesEnum.WriteCommerceOS],
        update: [ScopesEnum.WriteCommerceOS],
        delete: [ScopesEnum.WriteCommerceOS],
      },
      {
        microservice: 'connect',
        scopes: [ScopesEnum.ReadContacts, ScopesEnum.WriteContacts],
        read: [ScopesEnum.ReadContacts, ScopesEnum.WriteContacts],
        create: [ScopesEnum.WriteContacts],
        update: [ScopesEnum.WriteContacts],
        delete: [ScopesEnum.WriteContacts],
      },
      {
        microservice: 'contacts',
        scopes: [ScopesEnum.ReadContacts, ScopesEnum.WriteContacts],
        read: [ScopesEnum.ReadContacts, ScopesEnum.WriteContacts],
        create: [ScopesEnum.WriteContacts],
        update: [ScopesEnum.WriteContacts],
        delete: [ScopesEnum.WriteContacts],
      },
      {
        microservice: 'coupons',
        scopes: [ScopesEnum.ReadCoupons, ScopesEnum.WriteCoupons],
        read: [ScopesEnum.ReadCoupons, ScopesEnum.WriteCoupons],
        create: [ScopesEnum.WriteCoupons],
        update: [ScopesEnum.WriteCoupons],
        delete: [ScopesEnum.WriteCoupons],
      },
      {
        microservice: 'customers',
        scopes: [ScopesEnum.ReadCustomers, ScopesEnum.WriteCustomers],
        read: [ScopesEnum.ReadCustomers, ScopesEnum.WriteCustomers],
        create: [ScopesEnum.WriteCustomers],
        update: [ScopesEnum.WriteCustomers],
        delete: [ScopesEnum.WriteCustomers],
      },
      {
        microservice: 'inventories',
        scopes: [ScopesEnum.ReadInventory, ScopesEnum.WriteInventory],
        read: [ScopesEnum.ReadInventory, ScopesEnum.WriteInventory],
        create: [ScopesEnum.WriteInventory],
        update: [ScopesEnum.WriteInventory],
        delete: [ScopesEnum.WriteInventory],
      },
      {
        microservice: 'invoice',
        scopes: [ScopesEnum.ReadInvoice, ScopesEnum.WriteInvoice],
        read: [ScopesEnum.ReadInvoice, ScopesEnum.WriteInvoice],
        create: [ScopesEnum.WriteInvoice],
        update: [ScopesEnum.WriteInvoice],
        delete: [ScopesEnum.WriteInvoice],
      },
      {
        microservice: 'message',
        scopes: [ScopesEnum.ReadMessage, ScopesEnum.WriteMessage],
        read: [ScopesEnum.ReadMessage, ScopesEnum.WriteMessage],
        create: [ScopesEnum.WriteMessage],
        update: [ScopesEnum.WriteMessage],
        delete: [ScopesEnum.WriteMessage],
      },
      {
        microservice: 'pos',
        scopes: [ScopesEnum.ReadPOS, ScopesEnum.WritePOS],
        read: [ScopesEnum.ReadPOS, ScopesEnum.WritePOS],
        create: [ScopesEnum.WritePOS],
        update: [ScopesEnum.WritePOS],
        delete: [ScopesEnum.WritePOS],
      },
      {
        microservice: 'products',
        scopes: [ScopesEnum.ReadProducts, ScopesEnum.WriteProducts],
        read: [ScopesEnum.ReadProducts, ScopesEnum.WriteProducts],
        create: [ScopesEnum.WriteProducts],
        update: [ScopesEnum.WriteProducts],
        delete: [ScopesEnum.WriteProducts],
      },
      {
        microservice: 'shipping',
        scopes: [ScopesEnum.ReadShipping, ScopesEnum.WriteShipping],
        read: [ScopesEnum.ReadShipping, ScopesEnum.WriteShipping],
        create: [ScopesEnum.WriteShipping],
        update: [ScopesEnum.WriteShipping],
        delete: [ScopesEnum.WriteShipping],
      },
      {
        microservice: 'shop',
        scopes: [ScopesEnum.ReadShop, ScopesEnum.WriteShop],
        read: [ScopesEnum.ReadShop, ScopesEnum.WriteShop],
        create: [ScopesEnum.WriteShop],
        update: [ScopesEnum.WriteShop],
        delete: [ScopesEnum.WriteShop],
      },
      {
        microservice: 'site',
        scopes: [ScopesEnum.ReadSite, ScopesEnum.WriteSite],
        read: [ScopesEnum.ReadSite, ScopesEnum.WriteSite],
        create: [ScopesEnum.WriteSite],
        update: [ScopesEnum.WriteSite],
        delete: [ScopesEnum.WriteSite],
      },
      {
        microservice: 'social',
        scopes: [ScopesEnum.ReadSocial, ScopesEnum.WriteSocial],
        read: [ScopesEnum.ReadSocial, ScopesEnum.WriteSocial],
        create: [ScopesEnum.WriteSocial],
        update: [ScopesEnum.WriteSocial],
        delete: [ScopesEnum.WriteSocial],
      },
      {
        microservice: 'studio',
        scopes: [ScopesEnum.ReadStudio, ScopesEnum.WriteStudio],
        read: [ScopesEnum.ReadStudio, ScopesEnum.WriteStudio],
        create: [ScopesEnum.WriteStudio],
        update: [ScopesEnum.WriteStudio],
        delete: [ScopesEnum.WriteStudio],
      },
      {
        microservice: 'transactions',
        scopes: [ScopesEnum.ReadTransactions, ScopesEnum.WriteTransactions],
        read: [ScopesEnum.ReadTransactions, ScopesEnum.WriteTransactions],
        create: [ScopesEnum.WriteTransactions],
        update: [ScopesEnum.WriteTransactions],
        delete: [ScopesEnum.WriteTransactions],
      },
    ];

    for (const service of services) {
      if (service.scopes.some((scope: ScopesEnum) => scopes.includes(scope))) {
        acls.push({
          microservice: service.microservice,
          read: service.read.some((scope: ScopesEnum) => scopes.includes(scope)),
          create: service.create.some((scope: ScopesEnum) => scopes.includes(scope)),
          update: service.update.some((scope: ScopesEnum) => scopes.includes(scope)),
          delete: service.delete.some((scope: ScopesEnum) => scopes.includes(scope)),
        });
      }
    }

    return acls;
  }
}
