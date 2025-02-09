@folders
Feature: Test for Integration Wrapper, fetching results from ES & Mongo via folders-plugin
  Background:
    Given I load constants from "features/fixtures/const.ts"
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_USER_1}}",
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "permissions": [
              {
                "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
                "acls": []
              }
            ],
            "tags": [],
            "name": "merchant"
          },
          {
            "name": "user",
            "permissions": []
          },
          {
            "name": "admin",
            "permissions": []
          }
        ]
      }
      """
    And I use DB fixture "integrations/businesses"
    And I use DB fixture "integrations/integration-wrapper"
  Scenario: get integration folders list
    And I use DB fixture "integrations/integration-wrapper-folder"
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "connect-folder"
        ],
        "result": {
          "body": {
            "took": 12,
            "timed_out": false,
            "_shards": {
              "total": 1,
              "successful": 1,
              "skipped": 0,
              "failed": 0
            },
            "hits": {
              "total": {
                "value": 1,
                "relation": "eq"
              },
              "max_score": 3.4657357,
              "hits": [
                {
                  "_index": "connect-folder",
                  "_type": "_doc",
                  "_id": "43b855f1-9f88-4c1f-8eb0-e280331a57e1",
                  "_version": 1,
                  "_seq_no": 4565,
                  "_primary_term": 1,
                  "found": true,
                  "_source": {
                    "wrapperType": "credit_card",
                    "businessId": "{{ID_OF_EXISTING_BUSINESS}}",
                    "category": "payments",
                    "createdAt": "2022-12-13T10:30:19.874Z",
                    "developer": "integrations.payments.stripe.developer",
                    "developerTranslations": {
                      "en": "payever GmbH",
                      "de": "payever GmbH",
                      "da": "payever GmbH",
                      "es": "payever GmbH",
                      "no": "payever GmbH",
                      "sv": "payever GmbH"
                    },
                    "installed": true,
                    "integration": "06b3464b-9ed2-4952-9cb8-07aac0108a55",
                    "name": "stripe",
                    "scope": "business",
                    "title": "integrations.payments.stripe.title",
                    "titleTranslations": {
                      "en": "Stripe Credit Card",
                      "de": "Stripe Kreditkarte",
                      "da": "Stripe kreditkort",
                      "es": "Stripe Tarjeta de crédito",
                      "no": "Stripe kredittkort",
                      "sv": "Stripe kreditkort"
                    },
                    "userId": null,
                    "parentFolderId": "{{ID_OF_FOLDER_1}}",
                    "isFolder": false,
                    "serviceEntityId": "75809803-e77e-4768-bd90-59c4322f3dee",
                    "mongoId": "43b855f1-9f88-4c1f-8eb0-e280331a57e1"
                  }
                }
              ]
            }
          }
        }
      }
      """
    And I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["connect-folder"], "result": [] }
      """
    And I mock Elasticsearch method "count" with:
      """
      {
        "arguments": [
          "connect-folder"
        ],
        "result": {
          "body": {
            "count": 1
          }
        }
      }
      """
    Then I look for model "Integration" by following JSON and remember as "integration1":
      """
      {
        "_id": "06b3464b-9ed2-4952-9cb8-07aac0108a55"
      }
      """
    Then print storage key "integration1"
    When I send a GET request to "/api/folders/business/{{ID_OF_EXISTING_BUSINESS}}/folder/{{ID_OF_FOLDER_1}}/documents"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "collection": [
          {
            "_id": "71f5b7c5-9355-49e1-a965-1b18da6dd948",
            "isFolder": false,
            "parentFolderId": "c6e1daeb-fce5-449f-9279-ffac45dbf5ff",
            "scope": "business",
            "wrappedIntegrations": [
              {
                "allowedBusinesses": [
                  "_id-of-existing-business"
                ],
                "enabled": true,
                "order": 1,
                "scopes": [
                  "read_products",
                  "write_products"
                ],
                "category": "payments",
                "displayOptions": {
                  "title": "stripe",
                  "icon": "icon-stripe.png"
                },
                "installationOptions": {
                  "countryList": [],
                  "links": [],
                  "appSupport": "",
                  "category": "payment",
                  "description": "pay via stripe",
                  "developer": "1",
                  "languages": "en, de",
                  "optionIcon": "icon-stripe.png",
                  "price": "0.00",
                  "pricingLink": "",
                  "website": "",
                  "wrapperType": "credit_card"
                },
                "name": "stripe",
                "reviews": [],
                "timesInstalled": 1,
                "versions": [],
                "__v": 0,
                "wrapperType": "credit_card",
                "businessId": "_id-of-existing-business",
                "developer": "integrations.payments.stripe.developer",
                "developerTranslations": {
                  "en": "payever GmbH",
                  "de": "payever GmbH",
                  "da": "payever GmbH",
                  "es": "payever GmbH",
                  "no": "payever GmbH",
                  "sv": "payever GmbH"
                },
                "installed": true,
                "integration": "*",
                "scope": "business",
                "title": "integrations.payments.stripe.title",
                "titleTranslations": {
                  "en": "Stripe Credit Card",
                  "de": "Stripe Kreditkarte",
                  "da": "Stripe kreditkort",
                  "es": "Stripe Tarjeta de crédito",
                  "no": "Stripe kredittkort",
                  "sv": "Stripe kreditkort"
                },
                "userId": null,
                "parentFolderId": "c6e1daeb-fce5-449f-9279-ffac45dbf5ff",
                "isFolder": false,
                "serviceEntityId": "*"
              }
            ],
            "wrapperType": "credit_card",
            "displayOptions": {
              "icon": "#icon-payment-option-credit-card",
              "title": "integrations.payments.credit-card.title",
              "bgColor": "#59AFF9-#6755FF"
            },
            "optionIcon": "#icon-payment-option-credit-card",
            "category": "integrations.payments.credit-card.category",
            "developer": "integrations.payments.credit-card.developer",
            "languages": "integrations.payments.credit-card.languages",
            "description": "integrations.payments.credit-card.description"
          }
        ]
      }
      """
