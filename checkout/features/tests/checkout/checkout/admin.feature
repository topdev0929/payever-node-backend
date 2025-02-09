Feature: Checkout API

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "integrationOneId" following value:
      """
      "bce8ef2c-e88c-4066-acb0-1154bb995efc"
      """
    Given I remember as "integrationTwoId" following value:
      """
      "46dff89b-6190-4e55-bdc4-fa1888bda518"
      """
    Given I remember as "integrationThreeId" following value:
      """
      "6fc2e9be-bc7e-4c14-9f88-d3f9ffce9ba5"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """

  Scenario: Create first default checkout
    Given I use DB fixture "checkout/checkout/create/create-first-default"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "checkouts",
          {
          }
         ],
        "result": {}
      }
      """
    When I send a POST request to "/api/admin/checkouts" with json:
      """
      {
        "businessId": "{{businessId}}",
        "default": false,
        "name": "test",
        "logo": "logo",
        "settings":{
          "languages": []
        }
      }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "_id":"*",
        "businessId":"{{businessId}}",
        "name":"test",
        "logo":"logo",
        "settings":{
          "cspAllowedHosts":[],
          "testingMode":false,
          "languages":[]
        },
        "default":true,
        "sections":[],
        "createdAt":"*",
        "updatedAt":"*",
        "__v":"*"
      }
      """
    And I get "_id" from response and remember as "createdCheckoutId"
    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name":"media.event.media.assigned",
        "payload":{
          "filename":"logo",
          "container":"images",
          "relatedEntity":{
            "id":"{{createdCheckoutId}}",
            "type":"CheckoutModel"
          }
        }
      },
      {
        "name":"media.event.media.assigned",
        "payload":{
          "filename":"logo-thumbnail",
          "container":"images",
          "relatedEntity":{
            "id":"{{createdCheckoutId}}",
            "type":"CheckoutModel"
          }
        }
      },
      {
        "name":"media.event.media.assigned",
        "payload":{
          "filename":"logo-blurred",
          "container":"images",
          "relatedEntity":{
            "id":"{{createdCheckoutId}}",
            "type":"CheckoutModel"
          }
        }
      },
      {
        "name":"checkout.event.checkout.created",
        "payload":{
          "_id":"{{createdCheckoutId}}",
          "businessId":"{{businessId}}",
          "checkoutId":"*",
          "settings":{
            "cspAllowedHosts":[],
            "testingMode":false,
            "languages":[]
          },
          "default":true,
          "name":"test",
          "logo":"logo",
          "sections":[],
          "createdAt":"*",
          "updatedAt":"*",
          "__v":"*",
          "cspAllowedHosts":[]
        }
      }
    ]
    """

  Scenario: Create first default checkout without name
    Given I use DB fixture "checkout/checkout/create/create-first-default"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "checkouts",
          {
          }
         ],
        "result": {}
      }
      """
    When I send a POST request to "/api/admin/checkouts" with json:
      """
      {
        "businessId": "{{businessId}}",
        "default": false,
        "logo": "logo",
        "settings":{
          "languages": []
        }
      }
      """
    Then print last response
    And the response status code should be 400

  Scenario: Create new checkout with existing name
    Given I use DB fixture "checkout/checkout/create/create-already-exists"
    When I send a POST request to "/api/admin/checkouts" with json:
      """
      {
        "businessId": "{{businessId}}",
        "default": false,
        "name": "Existing checkout",
        "logo": "logo",
        "settings":{
          "languages": []
        }
      }
      """
    Then print last response
    And the response status code should be 409
    And the response should contain json:
      """
       {
         "statusCode": 409,
         "message": "Checkout name 'Existing checkout' not available"
       }
      """

  Scenario: Create new checkout as copy from default
    Given I use DB fixture "checkout/checkout/create/create-as-copy-from-default"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "checkouts",
          {
          }
         ],
        "result": {}
      }
      """
    When I send a POST request to "/api/admin/checkouts" with json:
      """
      {
        "businessId": "{{businessId}}",
        "default": false,
        "name": "New checkout",
        "logo": "logo",
        "settings":{
          "languages": []
        }
      }
      """
    Then print last response
    And the response status code should be 201
    And I get "_id" from response and remember as "createdCheckoutId"
    And the response should contain json:
      """
      {
        "_id":"{{createdCheckoutId}}",
        "name":"New checkout",
        "logo":"logo",
        "default":false,
        "businessId":"{{businessId}}",
        "sections":[
          {
            "code": "order",
            "enabled": true,
            "order": 0,
            "_id": "*"
          },
          {
            "code": "address",
            "enabled": true,
            "order": 1,
            "_id": "*"
          },
          {
            "code": "choosePayment",
            "enabled": true,
            "order": 2,
            "_id": "*"
          },
          {
            "options": {
              "skipButton": false
            },
            "code": "ocr",
            "enabled": true,
            "order": 3,
            "_id": "*"
          },
          {
            "code": "payment",
            "enabled": true,
            "order": 4,
            "_id": "*"
          },
          {
            "code": "user",
            "enabled": false,
            "order": 5,
            "_id": "*"
          }
        ],
        "settings":{
          "cspAllowedHosts":[],
          "testingMode":false,
          "languages":[
            {
              "_id":"*",
              "active":false,
              "isDefault":false,
              "code":"de",
              "name":"Deutsch"
            },
            {
              "_id":"*",
              "active":true,
              "isDefault":true,
              "code":"en",
              "name":"English"
            }
          ]
        },
        "createdAt":"*",
        "updatedAt":"*",
        "__v":"*"
      }
      """
    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name":"checkout.event.integration.enabled",
        "payload":{
          "checkout":{
            "_id":"{{createdCheckoutId}}",
            "businessId":"{{businessId}}",
            "default":false,
            "name":"New checkout",
            "logo":"logo",
            "settings":{
              "cspAllowedHosts":[],
              "testingMode":false,
              "languages":[
                {
                  "_id":"*",
                  "active":false,
                  "isDefault":false,
                  "code":"de",
                  "name":"Deutsch"
                },
                {
                  "_id":"*",
                  "active":true,
                  "isDefault":true,
                  "code":"en",
                  "name":"English"
                }
              ]
            },
            "sections":[
              {
                "code": "order",
                "enabled": true,
                "order": 0,
                "_id": "*"
              },
              {
                "code": "address",
                "enabled": true,
                "order": 1,
                "_id": "*"
              },
              {
                "code": "choosePayment",
                "enabled": true,
                "order": 2,
                "_id": "*"
              },
              {
                "options": {
                  "skipButton": false
                },
                "code": "ocr",
                "enabled": true,
                "order": 3,
                "_id": "*"
              },
              {
                "code": "payment",
                "enabled": true,
                "order": 4,
                "_id": "*"
              },
              {
                "code": "user",
                "enabled": false,
                "order": 5,
                "_id": "*"
              }
            ],
            "createdAt":"*",
            "updatedAt":"*",
            "__v":"*"
          },
          "integration":{
            "_id":"{{integrationOneId}}",
            "category":"payments",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-payment-option-santander",
              "title":"integrations.payments.santander_factoring_de.title"
            },
            "name":"santander_factoring_de",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*",
            "__v":0
          }
        }
      },
      {
        "name":"checkout.event.integration.enabled",
        "payload":{
          "checkout":{
            "_id":"{{createdCheckoutId}}",
            "businessId":"{{businessId}}",
            "default":false,
            "name":"New checkout",
            "logo":"logo",
            "settings":{
              "cspAllowedHosts":[],
              "testingMode":false,
              "languages":[
                {
                  "_id":"*",
                  "active":false,
                  "isDefault":false,
                  "code":"de",
                  "name":"Deutsch"
                },
                {
                  "_id":"*",
                  "active":true,
                  "isDefault":true,
                  "code":"en",
                  "name":"English"
                }
              ]
            },
            "sections": [
              {
                "code": "order",
                "enabled": true,
                "order": 0,
                "_id": "*"
              },
              {
                "code": "address",
                "enabled": true,
                "order": 1,
                "_id": "*"
              },
              {
                "code": "choosePayment",
                "enabled": true,
                "order": 2,
                "_id": "*"
              },
              {
                "options": {
                  "skipButton": false
                },
                "code": "ocr",
                "enabled": true,
                "order": 3,
                "_id": "*"
              },
              {
                "code": "payment",
                "enabled": true,
                "order": 4,
                "_id": "*"
              },
              {
                "code": "user",
                "enabled": false,
                "order": 5,
                "_id": "*"
              }
            ],
            "createdAt":"*",
            "updatedAt":"*",
            "__v":"*"
          },
          "integration":{
            "_id":"{{integrationTwoId}}",
            "category":"shippings",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-shipping-dhl-32",
              "title":"integrations.shippings.dhl.title"
            },
            "name":"dhl",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*",
            "__v":0
          }
        }
      },
      {
        "name":"checkout.event.integration.enabled",
        "payload":{
          "checkout":{
            "_id":"{{createdCheckoutId}}",
            "businessId":"{{businessId}}",
            "default":false,
            "name":"New checkout",
            "logo":"logo",
            "settings":{
              "cspAllowedHosts":[],
              "testingMode":false,
              "languages":[
                {
                  "_id":"*",
                  "active":false,
                  "isDefault":false,
                  "code":"de",
                  "name":"Deutsch"
                },
                {
                  "_id":"*",
                  "active":true,
                  "isDefault":true,
                  "code":"en",
                  "name":"English"
                }
              ]
            },
            "sections":[
              {
                "code": "order",
                "enabled": true,
                "order": 0,
                "_id": "*"
              },
              {
                "code": "address",
                "enabled": true,
                "order": 1,
                "_id": "*"
              },
              {
                "code": "choosePayment",
                "enabled": true,
                "order": 2,
                "_id": "*"
              },
              {
                "options": {
                  "skipButton": false
                },
                "code": "ocr",
                "enabled": true,
                "order": 3,
                "_id": "*"
              },
              {
                "code": "payment",
                "enabled": true,
                "order": 4,
                "_id": "*"
              },
              {
                "code": "user",
                "enabled": false,
                "order": 5,
                "_id": "*"
              }
            ],
            "createdAt":"*",
            "updatedAt":"*",
            "__v":"*"
          },
          "integration":{
            "_id":"{{integrationThreeId}}",
            "category":"communications",
            "displayOptions":{
              "_id":"*",
              "icon":"#icon-communication-twillio",
              "title":"Twilio SMS"
            },
            "name":"twilio",
            "settingsOptions":{
              "_id":"*",
              "source":"source"
            },
            "createdAt":"*",
            "updatedAt":"*",
            "__v":0
          }
        }
      },
      {
        "name":"media.event.media.assigned",
        "payload":{
          "filename":"logo",
          "container":"images",
          "relatedEntity":{
            "id":"{{createdCheckoutId}}",
            "type":"CheckoutModel"
          }
        }
      },
      {
        "name":"media.event.media.assigned",
        "payload":{
          "filename":"logo-thumbnail",
          "container":"images",
          "relatedEntity":{
            "id":"{{createdCheckoutId}}",
            "type":"CheckoutModel"
          }
        }
      },
      {
        "name":"media.event.media.assigned",
        "payload":{
          "filename":"logo-blurred",
          "container":"images",
          "relatedEntity":{
            "id":"{{createdCheckoutId}}",
            "type":"CheckoutModel"
          }
        }
      },
      {
        "name":"checkout.event.checkout.created",
        "payload":{
          "_id":"{{createdCheckoutId}}",
          "name":"New checkout",
          "logo":"logo",
          "businessId":"{{businessId}}",
          "checkoutId":"{{createdCheckoutId}}",
          "settings":{
            "cspAllowedHosts":[],
            "testingMode":false,
            "languages":[
              {
                "_id":"*",
                "active":false,
                "isDefault":false,
                "code":"de",
                "name":"Deutsch"
              },
              {
                "_id":"*",
                "active":true,
                "isDefault":true,
                "code":"en",
                "name":"English"
              }
            ]
          },
          "default":false,
          "sections":[
            {
              "code": "order",
              "enabled": true,
              "order": 0,
              "_id": "*"
            },
            {
              "code": "address",
              "enabled": true,
              "order": 1,
              "_id": "*"
            },
            {
              "code": "choosePayment",
              "enabled": true,
              "order": 2,
              "_id": "*"
            },
            {
              "options": {
                "skipButton": false
              },
              "code": "ocr",
              "enabled": true,
              "order": 3,
              "_id": "*"
            },
            {
              "code": "payment",
              "enabled": true,
              "order": 4,
              "_id": "*"
            },
            {
              "code": "user",
              "enabled": false,
              "order": 5,
              "_id": "*"
            }
          ],
          "createdAt":"*",
          "updatedAt":"*",
          "__v":0,
          "cspAllowedHosts":[]
        }
      }
    ]
    """

  Scenario: Create new checkout, endpoint permission
    Given I am not authenticated
    Given I use DB fixture "checkout/checkout/create/create-first-default"
    When I send a POST request to "/api/admin/checkouts" with json:
      """
      {
        "businessId": "{{businessId}}",
        "default": false,
        "name": "New checkout",
        "logo": "logo",
        "settings":{
          "languages": []
        }
      }
      """
    Then print last response
    And the response status code should be 403
