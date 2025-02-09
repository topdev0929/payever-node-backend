// tslint:disable: object-literal-sort-keys trailing-comma no-big-function whitespace no-duplicate-string
import { partialFactory, PartialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';

const seq: SequenceGenerator = new SequenceGenerator();

const defaultFactory: any = (): any => {
  seq.next();

  return ({
    _id: uuid.v4(),
    'application': {
        'data': {},
        'routing': [
            {
                'routeId': 'apple-main-page-route',
                'url': '/',
                'pageId': '4ee1550b-7387-41e4-a9c6-4dde39572d1c'
            }
        ],
        'contextId': '90c0aaaa-8d20-4e8d-bf74-814081d92f73',
        'pageIds': [
            '4ee1550b-7387-41e4-a9c6-4dde39572d1c'
        ]
    },
    'pages': {
        '4ee1550b-7387-41e4-a9c6-4dde39572d1c': {
            'id': '4ee1550b-7387-41e4-a9c6-4dde39572d1c',
            'type': 'replica',
            'variant': 'front',
            'master': null,
            'name': 'Main Page',
            'data': {},
            'templateId': '11d2c84d-b6b5-4fbf-8e42-f86630a03077',
            'stylesheetIds': {
                'desktop': '50fbf6cd-6868-4919-86b9-9cc01c6af6a7',
                'tablet': 'ad4cf08d-9464-47e5-a161-aebe80e5eda6',
                'mobile': '9bab5292-d3cf-415c-bae2-6c2dd4058ad5'
            },
            'contextId': '810abecd-49aa-426f-98d9-fd14d353552d'
        }
    },
    'templates': {
        '11d2c84d-b6b5-4fbf-8e42-f86630a03077': {
            'id': '06175df3-a3a6-4bb8-a737-b5b1f650ff6b',
            'type': 'document',
            'children': [
                {
                    'id': 'a44fb472-8d92-49d6-b0ad-516f64dfa4c0',
                    'type': 'mobile-menu',
                    'children': []
                },
                {
                    'id': 'cc4db00d-6913-4e67-bce8-b04d59ce0b51',
                    'type': 'section',
                    'meta': {
                        'deletable': false
                    },
                    'children': [
                        {
                            'id': 'ad61bcad-b7c2-4a2e-bf5c-fc6d6f1a48bb',
                            'type': 'logo',
                            'data': {
                                'src': 'https://payeverproduction.blob.core.windows.net/builder/529bdfd0-cb71-44d2-a9a3-dd1c768f1a23-apple.png'
                            },
                            'children': []
                        },
                        {
                            'id': '817d1cc9-5707-4792-adbc-f8b53c524588',
                            'type': 'menu',
                            'data': {
                                'routes': [
                                    {
                                        'title': 'Mac',
                                        'routeId': '/category/apple'
                                    },
                                    {
                                        'title': 'iPad',
                                        'routeId': '/category/Phones'
                                    },
                                    {
                                        'title': 'iPhone',
                                        'routeId': '/category/apple'
                                    },
                                    {
                                        'title': 'Watch',
                                        'routeId': '/category/Phones'
                                    },
                                    {
                                        'title': 'TV',
                                        'routeId': '/category/apple'
                                    },
                                    {
                                        'title': 'Music',
                                        'routeId': '/category/Phones'
                                    },
                                    {
                                        'title': 'Support',
                                        'routeId': '/category/apple'
                                    }
                                ]
                            },
                            'children': []
                        },
                        {
                            'id': '9ed689d2-914b-4eb9-8f1f-ff0b83e6ddfa',
                            'type': 'shop-cart',
                            'children': []
                        }
                    ]
                },
                {
                    'id': 'd894304a-c645-4415-98ee-7213643d513b',
                    'type': 'section',
                    'meta': {
                        'deletable': false
                    },
                    'children': [
                        {
                            'id': '52e01d3b-fd44-416b-8b6b-d8c7d6609c99',
                            'type': 'block',
                            'children': [
                                {
                                    'id': '0e9a02a9-f101-4d03-a286-d1ce29430c2a',
                                    'type': 'text',
                                    'data': {
                                        'text': '<span peb-link-type=\'internal\' peb-link-path=\'/\'>Shop and learn</span>'
                                    },
                                    'children': []
                                },
                                {
                                    'id': 'ed61da9d-e648-40ef-a38a-9f7c99987049',
                                    'type': 'text',
                                    'data': {
                                        'text': '<span peb-link-type=\'internal\' peb-link-path=\'/\'>Mac</span>'
                                    },
                                    'children': []
                                },
                                {
                                    'id': '47211a3f-9c53-4683-98b2-c267378768c9',
                                    'type': 'text',
                                    'data': {
                                        'text': '<span peb-link-type=\'internal\' peb-link-path=\'/\'>iPad</span>'
                                    },
                                    'children': []
                                },
                                {
                                    'id': 'ee266216-9b66-4a83-b5e1-4bc5794b9080',
                                    'type': 'text',
                                    'data': {
                                        'text': '<span peb-link-type=\'internal\' peb-link-path=\'/\'>iPhone</span>'
                                    },
                                    'children': []
                                },
                                {
                                    'id': 'd0b35037-56b9-4e35-ba95-5550ee2b00fd',
                                    'type': 'text',
                                    'data': {
                                        'text': '<span peb-link-type=\'internal\' peb-link-path=\'/\'>Watch</span>'
                                    },
                                    'children': []
                                }
                            ]
                        },
                        {
                            'id': 'c2f44e5f-989e-4580-af2d-842903d67a2d',
                            'type': 'block',
                            'children': [
                                {
                                    'id': 'c421c72f-2047-4b5c-ad4c-d5da7bcf4063',
                                    'type': 'text',
                                    'data': {
                                        'text': '<span peb-link-type=\'internal\' peb-link-path=\'/\'>Services</span>'
                                    },
                                    'children': []
                                },
                                {
                                    'id': 'cdc2e4ca-09ef-47de-94a5-eb0a62c095bc',
                                    'type': 'text',
                                    'data': {
                                        'text': '<span peb-link-type=\'internal\' peb-link-path=\'/\'>Apple Music</span>'
                                    },
                                    'children': []
                                },
                                {
                                    'id': '05ca3751-d050-4d93-8f76-fe4312730c4a',
                                    'type': 'text',
                                    'data': {
                                        'text': '<span peb-link-type=\'internal\' peb-link-path=\'/\'>Apple News+</span>'
                                    },
                                    'children': []
                                },
                                {
                                    'id': 'f64f4041-1b8a-4be8-93f2-8af3a211bae8',
                                    'type': 'text',
                                    'data': {
                                        'text': '<span peb-link-type=\'internal\' peb-link-path=\'/\'>Apple TV+</span>'
                                    },
                                    'children': []
                                },
                                {
                                    'id': 'e7e50fe6-9718-4508-a68d-51b64f503a88',
                                    'type': 'text',
                                    'data': {
                                        'text': '<span peb-link-type=\'internal\' peb-link-path=\'/\'>Apple Arcade</span>'
                                    },
                                    'children': []
                                }
                            ]
                        },
                        {
                            'id': 'aeebaded-e49d-415a-88cf-9b48db58afe0',
                            'type': 'block',
                            'children': [
                                {
                                    'id': '4f671df7-3f70-42dc-931d-e8147d64dc4e',
                                    'type': 'text',
                                    'data': {
                                        'text': '<span peb-link-type=\'internal\' peb-link-path=\'/\'>Apple Store</span>'
                                    },
                                    'children': []
                                },
                                {
                                    'id': 'a1e492a7-9f70-40f0-b024-949724e7808d',
                                    'type': 'text',
                                    'data': {
                                        'text': '<span peb-link-type=\'internal\' peb-link-path=\'/\'>Find a Store</span>'
                                    },
                                    'children': []
                                },
                                {
                                    'id': 'eff3ac6f-edc9-4336-ac9d-139e12db1767',
                                    'type': 'text',
                                    'data': {
                                        'text': '<span peb-link-type=\'internal\' peb-link-path=\'/\'>Shop Online</span>'
                                    },
                                    'children': []
                                },
                                {
                                    'id': '065cf852-70a7-4636-b1da-2e249b94bc88',
                                    'type': 'text',
                                    'data': {
                                        'text': '<span peb-link-type=\'internal\' peb-link-path=\'/\'>Genius Bar</span>'
                                    },
                                    'children': []
                                },
                                {
                                    'id': '5b873105-1b39-4f59-8f7e-5350be7a99f3',
                                    'type': 'text',
                                    'data': {
                                        'text': '<span peb-link-type=\'internal\' peb-link-path=\'/\'>Today at Apple</span>'
                                    },
                                    'children': []
                                }
                            ]
                        },
                        {
                            'id': '5cd21954-3cdb-4ec4-b443-593b5dbabac7',
                            'type': 'block',
                            'children': [
                                {
                                    'id': 'd72a17cb-93f7-4261-aa6f-c5434d8802af',
                                    'type': 'text',
                                    'data': {
                                        'text': '<span peb-link-type=\'internal\' peb-link-path=\'/\'>About Apple</span>'
                                    },
                                    'children': []
                                },
                                {
                                    'id': 'a0aaa496-7968-4788-b454-d28bd91d3c26',
                                    'type': 'text',
                                    'data': {
                                        'text': '<span peb-link-type=\'internal\' peb-link-path=\'/\'>Newsroom</span>'
                                    },
                                    'children': []
                                },
                                {
                                    'id': '577f15ce-3b7b-4f2f-9ea2-d20569ae7d66',
                                    'type': 'text',
                                    'data': {
                                        'text': '<span peb-link-type=\'internal\' peb-link-path=\'/\'>Apple Leadership</span>'
                                    },
                                    'children': []
                                },
                                {
                                    'id': '1cfec6a0-5ce9-436c-80d8-6c4c325d7342',
                                    'type': 'text',
                                    'data': {
                                        'text': '<span peb-link-type=\'internal\' peb-link-path=\'/\'>Job Opportunities</span>'
                                    },
                                    'children': []
                                },
                                {
                                    'id': '2bce785c-73b4-45a1-a73d-22142f85afad',
                                    'type': 'text',
                                    'data': {
                                        'text': '<span peb-link-type=\'internal\' peb-link-path=\'/\'>Events</span>'
                                    },
                                    'children': []
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    'stylesheets': {
        '50fbf6cd-6868-4919-86b9-9cc01c6af6a7': {
            '06175df3-a3a6-4bb8-a737-b5b1f650ff6b': {},
            'cc4db00d-6913-4e67-bce8-b04d59ce0b51': {
                'backgroundColor': '#333',
                'height': 44,
                'position': 'sticky',
                'top': 0,
                'zIndex': 1,
                'display': 'grid',
                'gridTemplateColumns': '100 824 100'
            },
            'ad61bcad-b7c2-4a2e-bf5c-fc6d6f1a48bb': {
                'width': 18,
                'height': 18,
                'margin': 16
            },
            '817d1cc9-5707-4792-adbc-f8b53c524588': {
                'fontSize': 14,
                'fontWeight': 400,
                'fontFamily': 'Helvetica Neue,Helvetica,Arial,sans-serif',
                'color': '#d6d6d6',
                'margin': 'auto'
            },
            '9ed689d2-914b-4eb9-8f1f-ff0b83e6ddfa': {
                'width': 20,
                'height': 44,
                'margin': '0 15 0 auto',
                'backgroundColor': '#333',
                'borderWidth': 3,
                'borderColor': '#d6d6d6'
            },
            'd894304a-c645-4415-98ee-7213643d513b': {
                'height': 200,
                'backgroundColor': '#f5f5f7',
                'display': 'grid',
                'gridTemplateColumns': '256 256 256 256'
            },
            '52e01d3b-fd44-416b-8b6b-d8c7d6609c99': {
                'display': 'grid',
                'gridTemplateRows': '50 30 30 30 30'
            },
            '0e9a02a9-f101-4d03-a286-d1ce29430c2a': {
                'marginTop': 20,
                'color': '#1e1e21',
                'font-wight': 500,
                'fontSize': 12
            },
            'ed61da9d-e648-40ef-a38a-9f7c99987049': {
                'color': '#7e7e7e',
                'fontSize': 12
            },
            '47211a3f-9c53-4683-98b2-c267378768c9': {
                'color': '#7e7e7e',
                'fontSize': 12
            },
            'ee266216-9b66-4a83-b5e1-4bc5794b9080': {
                'color': '#7e7e7e',
                'fontSize': 12
            },
            'd0b35037-56b9-4e35-ba95-5550ee2b00fd': {
                'color': '#7e7e7e',
                'fontSize': 12
            },
            'c2f44e5f-989e-4580-af2d-842903d67a2d': {
                'display': 'grid',
                'gridTemplateRows': '50 30 30 30 30'
            },
            'c421c72f-2047-4b5c-ad4c-d5da7bcf4063': {
                'marginTop': 20,
                'color': '#1e1e21',
                'font-wight': 500,
                'fontSize': 12
            },
            'cdc2e4ca-09ef-47de-94a5-eb0a62c095bc': {
                'color': '#7e7e7e',
                'fontSize': 12
            },
            '05ca3751-d050-4d93-8f76-fe4312730c4a': {
                'color': '#7e7e7e',
                'fontSize': 12
            },
            'f64f4041-1b8a-4be8-93f2-8af3a211bae8': {
                'color': '#7e7e7e',
                'fontSize': 12
            },
            'e7e50fe6-9718-4508-a68d-51b64f503a88': {
                'color': '#7e7e7e',
                'fontSize': 12
            },
            'aeebaded-e49d-415a-88cf-9b48db58afe0': {
                'display': 'grid',
                'gridTemplateRows': '50 30 30 30 30'
            },
            '4f671df7-3f70-42dc-931d-e8147d64dc4e': {
                'marginTop': 20,
                'color': '#1e1e21',
                'font-wight': 500,
                'fontSize': 12
            },
            'a1e492a7-9f70-40f0-b024-949724e7808d': {
                'color': '#7e7e7e',
                'fontSize': 12
            },
            'eff3ac6f-edc9-4336-ac9d-139e12db1767': {
                'color': '#7e7e7e',
                'fontSize': 12
            },
            '065cf852-70a7-4636-b1da-2e249b94bc88': {
                'color': '#7e7e7e',
                'fontSize': 12
            },
            '5b873105-1b39-4f59-8f7e-5350be7a99f3': {
                'color': '#7e7e7e',
                'fontSize': 12
            },
            '5cd21954-3cdb-4ec4-b443-593b5dbabac7': {
                'display': 'grid',
                'gridTemplateRows': '50 30 30 30 30'
            },
            'd72a17cb-93f7-4261-aa6f-c5434d8802af': {
                'marginTop': 20,
                'color': '#1e1e21',
                'font-wight': 500,
                'fontSize': 12
            },
            'a0aaa496-7968-4788-b454-d28bd91d3c26': {
                'color': '#7e7e7e',
                'fontSize': 12
            },
            '577f15ce-3b7b-4f2f-9ea2-d20569ae7d66': {
                'color': '#7e7e7e',
                'fontSize': 12
            },
            '1cfec6a0-5ce9-436c-80d8-6c4c325d7342': {
                'color': '#7e7e7e',
                'fontSize': 12
            },
            '2bce785c-73b4-45a1-a73d-22142f85afad': {
                'color': '#7e7e7e',
                'fontSize': 12
            }
        },
        'ad4cf08d-9464-47e5-a161-aebe80e5eda6': {
            '06175df3-a3a6-4bb8-a737-b5b1f650ff6b': {},
            'cc4db00d-6913-4e67-bce8-b04d59ce0b51': {
                'backgroundColor': '#333',
                'height': 44,
                'position': 'sticky',
                'top': 0,
                'zIndex': 1,
                'display': 'grid',
                'gridTemplateColumns': '1fr 2fr 1fr'
            },
            'ad61bcad-b7c2-4a2e-bf5c-fc6d6f1a48bb': {
                'width': 18,
                'height': 18,
                'margin': 16
            },
            '817d1cc9-5707-4792-adbc-f8b53c524588': {
                'fontSize': 14,
                'fontWeight': 400,
                'fontFamily': 'Helvetica Neue,Helvetica,Arial,sans-serif',
                'color': '#d6d6d6',
                'margin': 'auto'
            },
            '9ed689d2-914b-4eb9-8f1f-ff0b83e6ddfa': {
                'width': 20,
                'height': 44,
                'margin': '0 15 0 auto',
                'backgroundColor': '#333',
                'borderWidth': 3,
                'borderColor': '#d6d6d6'
            },
            'd894304a-c645-4415-98ee-7213643d513b': {
                'height': 200,
                'backgroundColor': '#f5f5f7',
                'display': 'grid',
                'gridTemplateColumns': '1fr 1fr'
            },
            '52e01d3b-fd44-416b-8b6b-d8c7d6609c99': {
                'display': 'grid',
                'gridTemplateRows': '50 30 30 30 30'
            },
            '0e9a02a9-f101-4d03-a286-d1ce29430c2a': {
                'marginTop': 20,
                'color': '#1e1e21',
                'font-wight': 500,
                'fontSize': 12,
                'margin': 'auto'
            },
            'ed61da9d-e648-40ef-a38a-9f7c99987049': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            '47211a3f-9c53-4683-98b2-c267378768c9': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            'ee266216-9b66-4a83-b5e1-4bc5794b9080': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            'd0b35037-56b9-4e35-ba95-5550ee2b00fd': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            'c2f44e5f-989e-4580-af2d-842903d67a2d': {
                'display': 'grid',
                'gridTemplateRows': '50 30 30 30 30'
            },
            'c421c72f-2047-4b5c-ad4c-d5da7bcf4063': {
                'marginTop': 20,
                'color': '#1e1e21',
                'font-wight': 500,
                'fontSize': 12,
                'margin': 'auto'
            },
            'cdc2e4ca-09ef-47de-94a5-eb0a62c095bc': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            '05ca3751-d050-4d93-8f76-fe4312730c4a': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            'f64f4041-1b8a-4be8-93f2-8af3a211bae8': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            'e7e50fe6-9718-4508-a68d-51b64f503a88': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            'aeebaded-e49d-415a-88cf-9b48db58afe0': {
                'display': 'grid',
                'gridTemplateRows': '50 30 30 30 30'
            },
            '4f671df7-3f70-42dc-931d-e8147d64dc4e': {
                'marginTop': 20,
                'color': '#1e1e21',
                'font-wight': 500,
                'fontSize': 12,
                'margin': 'auto'
            },
            'a1e492a7-9f70-40f0-b024-949724e7808d': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            'eff3ac6f-edc9-4336-ac9d-139e12db1767': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            '065cf852-70a7-4636-b1da-2e249b94bc88': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            '5b873105-1b39-4f59-8f7e-5350be7a99f3': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            '5cd21954-3cdb-4ec4-b443-593b5dbabac7': {
                'display': 'grid',
                'gridTemplateRows': '50 30 30 30 30'
            },
            'd72a17cb-93f7-4261-aa6f-c5434d8802af': {
                'marginTop': 20,
                'color': '#1e1e21',
                'font-wight': 500,
                'fontSize': 12,
                'margin': 'auto'
            },
            'a0aaa496-7968-4788-b454-d28bd91d3c26': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            '577f15ce-3b7b-4f2f-9ea2-d20569ae7d66': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            '1cfec6a0-5ce9-436c-80d8-6c4c325d7342': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            '2bce785c-73b4-45a1-a73d-22142f85afad': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            }
        },
        '9bab5292-d3cf-415c-bae2-6c2dd4058ad5': {
            '06175df3-a3a6-4bb8-a737-b5b1f650ff6b': {},
            'cc4db00d-6913-4e67-bce8-b04d59ce0b51': {
                'backgroundColor': '#333',
                'height': 44,
                'position': 'sticky',
                'top': 0,
                'zIndex': 1,
                'display': 'grid',
                'gridTemplateColumns': '1fr 2fr 1fr'
            },
            'ad61bcad-b7c2-4a2e-bf5c-fc6d6f1a48bb': {
                'width': 18,
                'height': 18,
                'margin': 16
            },
            '817d1cc9-5707-4792-adbc-f8b53c524588': {
                'fontSize': 14,
                'fontWeight': 400,
                'fontFamily': 'Helvetica Neue,Helvetica,Arial,sans-serif',
                'color': '#d6d6d6',
                'margin': 'auto'
            },
            '9ed689d2-914b-4eb9-8f1f-ff0b83e6ddfa': {
                'width': 20,
                'height': 44,
                'margin': '0 15 0 auto',
                'backgroundColor': '#333',
                'borderWidth': 3,
                'borderColor': '#d6d6d6'
            },
            'd894304a-c645-4415-98ee-7213643d513b': {
                'height': 200,
                'backgroundColor': '#f5f5f7'
            },
            '52e01d3b-fd44-416b-8b6b-d8c7d6609c99': {
                'display': 'grid',
                'gridTemplateRows': '50 30 30 30 30'
            },
            '0e9a02a9-f101-4d03-a286-d1ce29430c2a': {
                'marginTop': 20,
                'color': '#1e1e21',
                'font-wight': 500,
                'fontSize': 12,
                'margin': 'auto'
            },
            'ed61da9d-e648-40ef-a38a-9f7c99987049': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            '47211a3f-9c53-4683-98b2-c267378768c9': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            'ee266216-9b66-4a83-b5e1-4bc5794b9080': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            'd0b35037-56b9-4e35-ba95-5550ee2b00fd': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            'c2f44e5f-989e-4580-af2d-842903d67a2d': {
                'display': 'grid',
                'gridTemplateRows': '50 30 30 30 30'
            },
            'c421c72f-2047-4b5c-ad4c-d5da7bcf4063': {
                'marginTop': 20,
                'color': '#1e1e21',
                'font-wight': 500,
                'fontSize': 12,
                'margin': 'auto'
            },
            'cdc2e4ca-09ef-47de-94a5-eb0a62c095bc': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            '05ca3751-d050-4d93-8f76-fe4312730c4a': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            'f64f4041-1b8a-4be8-93f2-8af3a211bae8': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            'e7e50fe6-9718-4508-a68d-51b64f503a88': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            'aeebaded-e49d-415a-88cf-9b48db58afe0': {
                'display': 'grid',
                'gridTemplateRows': '50 30 30 30 30'
            },
            '4f671df7-3f70-42dc-931d-e8147d64dc4e': {
                'marginTop': 20,
                'color': '#1e1e21',
                'font-wight': 500,
                'fontSize': 12,
                'margin': 'auto'
            },
            'a1e492a7-9f70-40f0-b024-949724e7808d': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            'eff3ac6f-edc9-4336-ac9d-139e12db1767': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            '065cf852-70a7-4636-b1da-2e249b94bc88': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            '5b873105-1b39-4f59-8f7e-5350be7a99f3': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            '5cd21954-3cdb-4ec4-b443-593b5dbabac7': {
                'display': 'grid',
                'gridTemplateRows': '50 30 30 30 30'
            },
            'd72a17cb-93f7-4261-aa6f-c5434d8802af': {
                'marginTop': 20,
                'color': '#1e1e21',
                'font-wight': 500,
                'fontSize': 12,
                'margin': 'auto'
            },
            'a0aaa496-7968-4788-b454-d28bd91d3c26': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            '577f15ce-3b7b-4f2f-9ea2-d20569ae7d66': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            '1cfec6a0-5ce9-436c-80d8-6c4c325d7342': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            },
            '2bce785c-73b4-45a1-a73d-22142f85afad': {
                'color': '#7e7e7e',
                'fontSize': 12,
                'margin': 'auto'
            }
        }
    },
    'contextSchemas': {
        '810abecd-49aa-426f-98d9-fd14d353552d': {},
        '90c0aaaa-8d20-4e8d-bf74-814081d92f73': {
            '@logo': {
                'service': 'company',
                'method': 'getLogo',
                'params': []
            }
        }
    },
  });
};

export class ThemeSnapshotFactory {
  public static create: PartialFactory<any> = partialFactory<any>(defaultFactory);
}
