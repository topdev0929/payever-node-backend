// tslint:disable
import { environment } from '../src/environments';

const INSTALLATION_IMAGES_URL: string = `${environment.microUrlCustomCdn}/images/installation`;

export const IntegrationsFixture: any[] = [
  {
    _id: '91b4cf4a-5132-4296-a130-5353f9bb5097',
    name: 'instagram-posts',
    category: 'communications',
    enabled: true,
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/instagram-posts/action/{action}',
        initEndpoint: '/business/{businessId}/integration/instagram-posts/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_COMMUNICATIONS}/api',
    },
    displayOptions: {
      _id: 'cc9445f4-df4a-4468-82b8-2cd9c717d980',
      icon: '#icon-apps-instagram-28',
      title: 'instagram-posts',
    },
    installationOptions: {
      countryList: [],
      _id: 'cdd09d98-b73c-4f0e-9ce9-893f382f4194',
      links: [
        {
          _id: '927f1f88-2b96-411c-8602-3bc0c2f58339',
          type: 'img',
          url:
            'https://payevertesting.blob.core.windows.net/miscellaneous/a97cebf3-6742-475e-9399-451e0541861e-instagram.png',
        },
      ],
      optionIcon: '#icon-products-instagram-posts',
      price: 'integrations.products.instagram-posts.price',
      category: 'integrations.products.instagram-posts.category',
      developer: 'integrations.products.instagram-posts.developer',
      languages: 'integrations.products.instagram-posts.languages',
      description: 'integrations.products.instagram-posts.description',
      appSupport: 'integrations.products.instagram-posts.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.instagram.com/',
    },
    createdAt: '2020-10-13T18:13:41.339+0000',
    updatedAt: '2020-10-13T18:13:41.339+0000',
  },
  {
    _id: '91b4cf4a-5132-4296-a130-5353f9bb5096',
    name: 'facebook-posts',
    category: 'communications',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/facebook-posts/action/{action}',
        initEndpoint: '/business/{businessId}/integration/facebook-posts/form'
      },
      url: '${MICRO_URL_THIRD_PARTY_COMMUNICATIONS}/api'
    },
    displayOptions: {
      _id: 'cc9445f4-df4a-4468-82b8-2cd9c717d980',
      icon: '#icon-products-facebook',
      title: 'facebook-posts',
      bgColor: '#3975EA-#3C7FFF',
    },
    installationOptions: {
      countryList: [],
      _id: 'cdd09d98-b73c-4f0e-9ce9-893f382f4194',
      links: [
        {
          _id: '927f1f88-2b96-411c-8602-3bc0c2f58339',
          type: 'img',
          url:
            'https://payevertesting.blob.core.windows.net/miscellaneous/a97cebf3-6742-475e-9399-451e0541861e-facebook.png'
        },
      ],
      optionIcon: '#icon-products-facebook-posts',
      price: 'integrations.products.facebook-posts.price',
      category: 'integrations.products.facebook-posts.category',
      developer: 'integrations.products.facebook-posts.developer',
      languages: 'integrations.products.facebook-posts.languages',
      description: 'integrations.products.facebook-posts.description',
      appSupport: 'integrations.products.facebook-posts.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.facebook.com/'
    },
    createdAt: '2020-10-13T18:13:41.339+0000',
    updatedAt: '2020-10-13T18:13:41.339+0000'
  },
  {
    _id: '91b4cf4a-5132-4296-a130-5353f9bb1196',
    name: 'twitter',
    category: 'communications',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/twitter/action/{action}',
        initEndpoint: '/business/{businessId}/integration/twitter/form'
      },
      url: '${MICRO_URL_THIRD_PARTY_COMMUNICATIONS}/api'
    },
    displayOptions: {
      _id: 'cc9445f4-df4a-4468-82b8-2cd9c717d980',
      icon: '#icon-products-twitter',
      title: 'twitter',
      bgColor: '#3975EA-#3C7FFF',
    },
    installationOptions: {
      countryList: [],
      _id: 'cdd09d98-b73c-4f0e-9ce9-893f382f4194',
      links: [
        {
          _id: '927f1f88-2b96-411c-8602-3bc0c2f58339',
          type: 'img',
          url:
            'https://payevertesting.blob.core.windows.net/miscellaneous/a97cebf3-6742-475e-9399-451e0541861e-twitter.png'
        },
      ],
      optionIcon: '#icon-products-twitter',
      price: 'integrations.products.twitter.price',
      category: 'integrations.products.twitter.category',
      developer: 'integrations.products.twitter.developer',
      languages: 'integrations.products.twitter.languages',
      description: 'integrations.products.twitter.description',
      appSupport: 'integrations.products.twitter.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.twitter.com/'
    },
    createdAt: '2020-10-13T18:13:41.339+0000',
    updatedAt: '2020-10-13T18:13:41.339+0000'
  },
  {
    _id: '91b4cf4a-5144-4296-a130-5353f9bb5096',
    name: 'youtube',
    category: 'communications',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/youtube/action/{action}',
        initEndpoint: '/business/{businessId}/integration/youtube/form'
      },
      url: '${MICRO_URL_THIRD_PARTY_COMMUNICATIONS}/api'
    },
    displayOptions: {
      _id: 'cc9445f4-df4a-4468-82b8-2cd9c717d980',
      icon: '#icon-products-youtube',
      title: 'youtube',
      bgColor: '#3975EA-#3C7FFF',
    },
    installationOptions: {
      countryList: [],
      _id: 'cdd09d98-b73c-4f0e-9ce9-893f382f4194',
      links: [
        {
          _id: '927f1f88-2b96-411c-8602-3bc0c2f58339',
          type: 'img',
          url:
            'https://payevertesting.blob.core.windows.net/miscellaneous/a97cebf3-6742-475e-9399-451e0541861e-youtube.png'
        },
      ],
      optionIcon: '#icon-products-youtube',
      price: 'integrations.products.youtube.price',
      category: 'integrations.products.youtube.category',
      developer: 'integrations.products.youtube.developer',
      languages: 'integrations.products.youtube.languages',
      description: 'integrations.products.youtube.description',
      appSupport: 'integrations.products.youtube.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.youtube.com/'
    },
    createdAt: '2020-10-13T18:13:41.339+0000',
    updatedAt: '2020-10-13T18:13:41.339+0000'
  },
  {
    _id: '91b4cf4a-5132-4296-c130-1253f9bb1196',
    name: 'linkedin',
    category: 'communications',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/linkedin/action/{action}',
        initEndpoint: '/business/{businessId}/integration/linkedin/form'
      },
      url: '${MICRO_URL_THIRD_PARTY_COMMUNICATIONS}/api'
    },
    displayOptions: {
      _id: 'cc9445f4-df4a-4468-82b8-2cd9c717d980',
      icon: '#icon-products-linkedin',
      title: 'linkedin',
      bgColor: '#3975EA-#3C7FFF',
    },
    installationOptions: {
      countryList: [],
      _id: 'cdd09d98-b73c-4f0e-9ce9-893f382f4194',
      links: [
        {
          _id: '927f1f88-2b96-411c-8602-3bc0c2f58339',
          type: 'img',
          url:
            'https://payevertesting.blob.core.windows.net/miscellaneous/a97cebf3-6742-475e-9399-451e0541861e-linkedin.png'
        },
      ],
      optionIcon: '#icon-products-linkedin',
      price: 'integrations.products.linkedin.price',
      category: 'integrations.products.linkedin.category',
      developer: 'integrations.products.linkedin.developer',
      languages: 'integrations.products.linkedin.languages',
      description: 'integrations.products.linkedin.description',
      appSupport: 'integrations.products.linkedin.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.linkedin.com/'
    },
    createdAt: '2020-10-13T18:13:41.339+0000',
    updatedAt: '2020-10-13T18:13:41.339+0000'
  },
  {
    _id: 'dacb5f07-ee9c-4fbb-8f71-83a322f93dcf',
    name: 'pinterest',
    category: 'social',
    connect: {
      formAction: {
        actionEndpoint: '/business/{businessId}/integration/pinterest/action/{action}',
        initEndpoint: '/business/{businessId}/integration/pinterest/form',
      },
      url: '${MICRO_URL_THIRD_PARTY_SOCIAL}/api',
    },
    displayOptions: {
      _id: '9316decc-718e-4fcf-9243-1e14c3b85e29',
      icon: '#icon-products-pinterest',
      title: 'integrations.social.pinterest.title',
      bgColor: '#3975EA-#3C7FFF',
    },
    enabled: true,
    installationOptions: {
      countryList: [],
      _id: 'cdd09d98-b73c-4f0e-9ce9-893f382f4194',
      links: [
        {
          _id: '11559564-7d9c-4968-a799-5f9b5ab03de6',
          type: 'img',
          url: `${INSTALLATION_IMAGES_URL}/social/pinterest.png`,
        },
      ],
      optionIcon: '#icon-products-pinterest',
      price: 'integrations.products.pinterest.price',
      category: 'integrations.products.pinterest.category',
      developer: 'integrations.products.pinterest.developer',
      languages: 'integrations.products.pinterest.languages',
      description: 'integrations.products.pinterest.description',
      appSupport: 'integrations.products.pinterest.support_link',
      website: 'https://getpayever.com/connect/',
      pricingLink: 'https://www.pinterest.com/',
    },
    createdAt: '2022-05-25T18:13:41.339+0000',
    updatedAt: '2022-06-01T18:14:49.339+0000',
  },
];
