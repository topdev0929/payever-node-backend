import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { BusinessInterface, Template } from '../../src/mailer/interfaces';
import { BusinessSchemaName } from '../../src/mailer/schemas';

class MailTemplatesFixture extends BaseFixture {
  private readonly model: Model<BusinessInterface> = this.application.get(getModelToken(BusinessSchemaName));

  public async apply(): Promise<void> {
    await this.model.create(
      {
        _id: '614cb154-0323-4df0-be89-85376b9de666',
        companyAddress: {
          _id: '96c9726b-c216-468d-aafb-4b0f126c8409',
          city: 'Nürnberg',
          country: 'DE',
          street: 'Marthastraße 31',
          zipCode: '90482',
        },
        companyDetails: {
          _id: 'd8b363ed-c837-420b-a80b-8ec7414e178f',
          legalForm: 'LEGAL_FORM_AG',
          urlWebsite: '',
        },
        contactDetails: {
          _id: '7456cf10-2eb7-4107-80d7-33530875909c',
          phone: '12341234',
        },
        contactEmails: ['arst@arst.com'],
        name: 'Test Business',
        owner: '2b8d46a1-f296-4ad9-8bcf-ed7348ed216a',
      },
      {
        _id: '3bc2d7f7-cea6-4986-9b46-26a3011225a7',
        companyAddress: {
          _id: 'e39d2368-00e8-44f9-93ac-53e4bc4d0ce5',
          city: 'Nürnberg',
          country: 'DE',
          street: 'Marthastraße 31',
          zipCode: '90482',
        },
        companyDetails: {
          _id: '2847435b-bd2f-4c89-998b-f95d1dbafb17',
          legalForm: 'LEGAL_FORM_AG',
          urlWebsite: '',
        },
        contactDetails: {
          _id: 'd0def39d-9a1f-4792-b0bf-15da52f936fc',
          phone: '12341234',
        },
        contactEmails: ['arst@arst.com'],
        name: 'Test Business',
        owner: '86c5356b-7329-4874-bd74-b68572577726',
      },
      {
        _id: '46fd0097-0b6e-46ba-8272-2f0770fc4c14',
        companyAddress: {
          _id: 'ac39dc65-9d8a-4407-a9e6-3170085a7089',
          city: 'Nürnberg',
          country: 'DE',
          street: 'Marthastraße 31',
          zipCode: '90482',
        },
        companyDetails: {
          _id: 'ab869335-db64-497e-b6e1-1c0ee75c2e1c',
          legalForm: 'LEGAL_FORM_AG',
          urlWebsite: '',
        },
        contactDetails: {
          _id: 'b5abb48e-3e55-4636-8d96-6a7d2dfad980',
          phone: '12341234',
        },
        contactEmails: ['arst@arst.com'],
        name: 'Test Business',
        owner: '17eac371-b641-4b57-9e0b-8adbbf776878',
      },

      {
        __v : 0,
        _id : 'b3d5f17b-1bda-47cf-a752-7dc3fe0f6f0b',
        companyAddress : {
          _id : 'e8df940d-da1a-463e-ab46-0248763ac0c0',
          city : 'Reichenbach im Vogtland',
          country : 'DE',
          street : 'Zwickauer Straße 12',
          zipCode : '08468',
        },
        companyDetails : {
          _id : '0fa3c84b-9dfe-4c86-9b53-b64a65fc97cf',
          createdAt : '2021-09-02T11:00:16.438Z',
          updatedAt : '2021-09-02T11:00:16.438Z',
        },
        contactDetails : {
          _id : 'f5e12a16-fbc9-4754-bc15-c41e440e895b',
          firstName : 'Torsten',
          lastName : 'Böhm',
          phone : '',
        },
        contactEmails : [],
        createdAt : '2021-09-02T11:00:16.185Z',
        defaultLanguage : 'de',
        logo : '57a15dd4-3b21-438d-bdf0-431f45324f09-boehm_O.jpeg',
        name : 'boehm Reichenbach',
        owner : '2b8d46a1-f296-4ad9-8bcf-ed7348ed216a',
        updatedAt : '2021-09-02T11:00:16.438Z',
      },

      {
        __v : 0,
        _id : '309189bf-f9e3-4d3b-a7f9-ad77c2bd8171',
        companyAddress : {
          _id : 'e8df940d-da1a-463e-ab46-0248763ac0c0',
          city : 'London',
          country : 'EN',
          street : 'Baker',
          zipCode : '08468',
        },
        companyDetails : {
          _id : '0fa3c84b-9dfe-4c86-9b53-b64a65fc97cf',
          createdAt : '2021-09-02T11:00:16.438Z',
          updatedAt : '2021-09-02T11:00:16.438Z',
        },
        contactDetails : {
          _id : 'f5e12a16-fbc9-4754-bc15-c41e440e895b',
          firstName : 'John',
          lastName : 'Smith',
          phone : '',
        },
        contactEmails : [],
        createdAt : '2021-09-02T11:00:16.185Z',
        defaultLanguage : 'en',
        logo : '57a15dd4-3b21-438d-bdf0-431f45324f09-boehm_O.jpeg',
        name : 'big ben',
        owner : '2b8d46a1-f296-4ad9-8bcf-ed7348ed216a',
        updatedAt : '2021-09-02T11:00:16.438Z',
      },

      {
        _id: "c49b75b2-f0a2-4f0c-abcf-ad43a90ba2c1",
        __v: 0,
        companyAddress: {
          _id: "d95531db-bf05-4519-8168-babcc5daf95f",
          country: "DK"
        },
        companyDetails : {
          _id : 'b8781672-86c3-471d-b8b4-ba410530d830',
          createdAt : '2022-09-02T11:00:16.438Z',
          updatedAt : '2022-09-02T11:00:16.438Z',
        },
        contactDetails: {
          _id: "a4cc3b36-9500-4aab-af72-b60aff74dd9f",
          firstName: "Dmytro",
          lastName: "Romanenko"
        },
        contactEmails: [],
        defaultLanguage: "da",
        name: "Denmark",
        owner: "28804dcf-9fa0-4543-9b3d-e68464ccd69a",
      }
    );
  }
}

export = MailTemplatesFixture;
