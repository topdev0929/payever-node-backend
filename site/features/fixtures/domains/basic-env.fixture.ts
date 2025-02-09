import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';

import {
    DomainSchemaName,
    SiteAccessConfigDocument,
    SiteAccessConfigSchemaName,
    SiteDocument,
    SiteSchemaName,
} from '../../../src/sites/schemas';
import { BusinessModel, DomainModel, SiteAccessModel } from '../../../src/sites/models';
import { BusinessSchemaName } from '@pe/business-kit';
import { CompiledThemeSchemaName } from '@pe/builder-theme-kit';
import { SiteAccessConfigFactory } from '../factories';

const BUSINESS_ID_1: string = '_id-of-business_1';
const BUSINESS_ID_2: string = '_id-of-business_2';
const SITE_ID_1: string = '_id-of-site_1';
const SITE_ID_2: string = '_id-of-site_2';
const DOMAIN_ID_1: string = '_id-of-domain_1';
const DOMAIN_ID_2: string = '_id-of-domain_2';
const DOMAIN_ID_3: string = '_id-of-domain_3';
const DOMAIN_NAME: string = 'promo129.example.com';
const CHANNEL_SET_ID_1: string = '_id-of-channel-set_1';
const ACCESS_CONFIG_ID_1: string = '_id-of-access-config_1';

export = class BasicEnvFixture extends BaseFixture {
    protected readonly compiledThemeModel: Model<any>
        = this.application.get(getModelToken(CompiledThemeSchemaName));
    private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
    private readonly siteModel: Model<SiteDocument> = this.application.get(getModelToken(SiteSchemaName));
    private readonly domainsModel: Model<DomainModel> = this.application.get(getModelToken(DomainSchemaName));
    private readonly siteAcessConfigModel: Model<SiteAccessModel>
        = this.application.get(getModelToken(SiteAccessConfigSchemaName));
    public async apply(): Promise<void> {
        await this.businessModel.create({
            _id: BUSINESS_ID_1,
            name: 'business-1',
        });

        await this.siteModel.create({
            _id: SITE_ID_1,
            accessConfig: [ACCESS_CONFIG_ID_1],
            businessId: BUSINESS_ID_1,
            channelSet: CHANNEL_SET_ID_1,
            domain: [DOMAIN_ID_1, DOMAIN_ID_2],
            isDefault: false,
            name: 'first-site',
        });

        await this.domainsModel.create({
            _id: DOMAIN_ID_1,
            isConnected: false,
            name: 'google.com',
            provider: 'provider-name',
            site: SITE_ID_1,
        });

        await this.domainsModel.create({
            _id: "dsfsdfsdfdsf-sdfsdfwe-ew",
            isConnected: false,
            name: 'mysite.com',
            provider: 'provider-name',
            site: SITE_ID_1,
        });

        await this.domainsModel.create({
            _id: DOMAIN_ID_2,
            isConnected: false,
            name: 'second-ever-domain.org',
            provider: 'provicer-name',
            site: SITE_ID_1,
        });

        await this.businessModel.create({
            _id: BUSINESS_ID_2,
            name: 'business-2',
        });

        await this.siteModel.create({
            _id: SITE_ID_2,
            accessConfig: [ACCESS_CONFIG_ID_1],
            businessId: BUSINESS_ID_2,
            channelSet: CHANNEL_SET_ID_1,
            domain: [],
            isDefault: false,
            name: 'second-site',
        });

        await this.domainsModel.create({
            _id: DOMAIN_ID_3,
            isConnected: false,
            name: 'third-ever-domain.org',
            provider: 'provider-name',
            site: SITE_ID_2,
        });

        await this.siteAcessConfigModel.create(SiteAccessConfigFactory.create({
            _id: ACCESS_CONFIG_ID_1,
            isLive: true,
            site: SITE_ID_1,
            internalDomain: 'mysite',
            ownDomain: 'google-com',
        }));
        await this.siteAcessConfigModel.create(SiteAccessConfigFactory.create({
            _id: "sfsdfsdf-sdfsdf-sdf",
            isLive: true,
            site: SITE_ID_1,
            internalDomain: 'mysite2',
            ownDomain: 'mysite-com',
        }));
        await this.compiledThemeModel.create(
            {
                "_id": "660d35e4-5042-41fc-a475-4156646e9822",
                "__v": 0,
                "application": SITE_ID_1,
                "builderVersion": "2",
                "context": {},
                "data": {
                    "productPages": "/products/:productId",
                    "categoryPages": "/zubehor/:categoryId",
                    "languages": [
                        {
                            "language": "english",
                            "active": true,
                        },
                        {
                            "language": "german",
                            "active": true,
                        }
                    ],
                    "defaultLanguage": "english",
                },
                "versionNumber": 43,
            },
        )
    }
};
