Feature: Checkout API

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "checkoutId" following value:
      """
      "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario: Update checkout
    Given I use DB fixture "checkout/checkout/update/existing"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "checkouts",
          {
            "_id": "{{checkoutId}}"
          }
         ],
        "result": {}
      }
      """
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}" with json:
      """
      {
        "default": false,
        "name": "New checkout name",
        "logo": "New checkout logo",
        "settings": {
          "phoneNumber": 123456789,
          "testingMode": false,
           "enableCustomerAccount": false,
           "enablePayeverTerms": false,
           "enableLegalPolicy": false,
           "enableDisclaimerPolicy": false,
           "enableRefundPolicy": false,
           "enableShippingPolicy": false,
           "enablePrivacyPolicy": false
        },
        "sections": [
          {
            "allowed_only_channels": [],
            "excluded_channels": [],
            "allowed_only_integrations": [],
            "excluded_integrations": [],
            "_id": "87695a9d-ab32-4fa5-b958-cf637eb6340a",
            "code": "order",
            "defaultEnabled": true,
            "order": 0,
            "subsections": [
              {
                "_id": "9a6ee51f-30d2-44f9-a880-3d0d4af5727b",
                "rules": [
                  {
                    "_id": "*",
                    "type": "flow_property",
                    "property": "cart",
                    "operator": "isNotEmpty"
                  }
                ],
                "code": "cart"
              },
              {
                "_id": "91cad3f0-d48a-4d37-a46f-5bfbacf36ad0",
                "rules": [
                  {
                    "_id": "*",
                    "type": "flow_property",
                    "property": "cart",
                    "operator": "isEmpty"
                  }
                ],
                "code": "amount_reference"
              }
            ],
            "options": {},
            "enabled": true
          },
          {
            "allowed_only_channels": [
              "pos"
            ],
            "allowed_only_integrations": [],
            "excluded_integrations": [],
            "excluded_channels": [],
            "_id": "bf23c107-0d37-47cf-b85f-6faea2a91d9b",
            "code": "ocr",
            "fixed": false,
            "defaultEnabled": true,
            "order": 6,
            "options": {
              "skipButton": false
            },
            "subsections": [
              {
                "_id": "3b7badfc-e6a4-4499-b592-415a1a857ce6",
                "rules": [],
                "code": "checkout-main-ocr"
              }
            ],
            "enabled": true
          },
          {
            "allowed_only_channels": [],
            "excluded_channels": [],
            "allowed_only_integrations": [],
            "excluded_integrations": [],
            "_id": "67b70735-bd5c-4894-b17f-1e9e8a7a1515",
            "code": "address",
            "fixed": false,
            "defaultEnabled": true,
            "order": 2,
            "subsections": [
              {
                "_id": "ee04ca85-9885-4736-b468-f48691c95051",
                "rules": [],
                "code": "checkout-main-address"
              }
            ],
            "options": {},
            "enabled": true
          },
          {
            "allowed_only_channels": [],
            "excluded_channels": [],
            "allowed_only_integrations": [],
            "excluded_integrations": [],
            "_id": "939dfaa7-908e-478a-bc68-1018da075eb6",
            "code": "user",
            "fixed": false,
            "defaultEnabled": true,
            "order": 1,
            "subsections": [
              {
                "_id": "9869c0b9-5c9f-47a4-b31c-1fc93c1cadaf",
                "rules": [],
                "code": "checkout-main-user"
              }
            ],
            "options": {},
            "enabled": true
          },
          {
            "allowed_only_channels": [],
            "excluded_channels": [],
            "allowed_only_integrations": [],
            "excluded_integrations": [],
            "_id": "aaa84f89-e4b9-47f9-80f9-decf697294ea",
            "code": "choosePayment",
            "fixed": true,
            "defaultEnabled": true,
            "order": 4,
            "subsections": [
              {
                "_id": "a25f79e0-7aa3-4b01-bdaa-473a24806feb",
                "rules": [],
                "code": "checkout-main-choose-payment"
              }
            ],
            "options": {},
            "enabled": true
          },
          {
            "allowed_only_channels": [],
            "excluded_channels": [],
            "allowed_only_integrations": [],
            "excluded_integrations": [],
            "_id": "dc558619-fa10-4baf-978b-b2c33b1deb82",
            "code": "payment",
            "fixed": true,
            "defaultEnabled": true,
            "order": 5,
            "subsections": [
              {
                "_id": "*",
                "rules": [],
                "code": "checkout-main-payment"
              }
            ],
            "options": {},
            "enabled": true
          },
          {
            "allowed_only_channels": [],
            "excluded_channels": [],
            "allowed_only_integrations": [],
            "excluded_integrations": [],
            "_id": "e16ebb03-20f2-4517-a97b-41de5086f97a",
            "code": "shipping",
            "fixed": false,
            "defaultEnabled": true,
            "order": 3,
            "subsections": [
              {
                "_id": "c5164dbc-fd07-4984-a43d-a02e31ea1aa1",
                "rules": [],
                "code": "checkout-main-shipping"
              }
            ],
            "options": {},
            "enabled": false
          }
        ]
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id":"*",
        "businessId":"{{businessId}}",
        "name":"New checkout name",
        "logo":"New checkout logo",
        "settings": {
          "phoneNumber": 123456789,
          "testingMode": false,
          "enableCustomerAccount": false,
          "enablePayeverTerms": false,
          "enableLegalPolicy": false,
          "enableDisclaimerPolicy": false,
          "enableRefundPolicy": false,
          "enableShippingPolicy": false,
          "enablePrivacyPolicy": false
        },
        "sections": [
          {
            "_id": "*",
            "code": "order",
            "order": 0,
            "enabled": true
          },
          {
            "_id": "*",
            "code": "ocr",
            "options": {
              "skipButton": false
            },
            "order": 6,
            "enabled": true
          },
          {
            "_id": "*",
            "code": "address",
            "order": 2,
            "enabled": true
          },
          {
            "_id": "*",
            "code": "user",
            "order": 1,
            "enabled": true
          },
          {
            "_id": "*",
            "code": "choosePayment",
            "order": 4,
            "enabled": true
          },
          {
            "_id": "*",
            "code": "payment",
            "order": 5,
            "enabled": true
          },
          {
            "_id": "*",
            "code": "shipping",
            "order": 3,
            "enabled": false
          }
        ]
      }
      """
    Then model "Checkout" with id "{{checkoutId}}" should contain json:
      """
      {
        "name": "New checkout name",
        "logo": "New checkout logo",
        "settings": {
          "phoneNumber": 123456789,
          "testingMode": false
        }
      }
      """
    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name":"media.event.media.assigned",
          "payload":{
            "filename":"New checkout logo",
            "container":"images",
            "relatedEntity":{
              "id":"{{checkoutId}}",
              "type":"CheckoutModel"
            }
          }
        },
        {
          "name":"media.event.media.assigned",
          "payload":{
            "filename":"New checkout logo-thumbnail",
            "container":"images",
            "relatedEntity":{
              "id":"{{checkoutId}}",
              "type":"CheckoutModel"
            }
          }
        },
        {
          "name":"media.event.media.assigned",
          "payload":{
            "filename":"New checkout logo-blurred",
            "container":"images",
            "relatedEntity":{
              "id":"{{checkoutId}}",
              "type":"CheckoutModel"
            }
          }
        },
        {
          "name":"media.event.media.removed",
          "payload":{
            "filename":"Existing checkout logo",
            "container":"images",
            "relatedEntity":{
              "id":"{{checkoutId}}",
              "type":"CheckoutModel"
            }
          }
        },
        {
          "name":"media.event.media.removed",
          "payload":{
            "filename":"Existing checkout logo-thumbnail",
            "container":"images",
            "relatedEntity":{
              "id":"{{checkoutId}}",
              "type":"CheckoutModel"
            }
          }
        },
        {
          "name":"media.event.media.removed",
          "payload":{
            "filename":"Existing checkout logo-blurred",
            "container":"images",
            "relatedEntity":{
              "id":"{{checkoutId}}",
              "type":"CheckoutModel"
            }
          }
        },
        {
          "name":"checkout.event.checkout.updated",
          "payload":{
            "_id":"{{checkoutId}}",
            "default":false,
            "name":"New checkout name",
            "businessId":"{{businessId}}",
            "checkoutId":"{{checkoutId}}",
            "settings":{
              "cspAllowedHosts":[],
              "testingMode":false,
              "phoneNumber":"123456789",
              "languages":[]
            },
            "logo":"New checkout logo",
            "createdAt":"*",
            "updatedAt":"*",
            "__v":"*",
            "cspAllowedHosts":[]
          }
        }
      ]
      """

  Scenario: Update checkout payever terms validation
    Given I use DB fixture "checkout/checkout/update/existing"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "checkouts",
          {
            "_id": "{{checkoutId}}"
          }
         ],
        "result": {}
      }
      """
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}" with json:
      """
      {
        "default": false,
        "name": "New checkout name",
        "logo": "New checkout logo",
        "settings": {
          "phoneNumber": 123456789,
          "testingMode": false,
           "enableCustomerAccount": true,
           "enablePayeverTerms": false,
           "enableLegalPolicy": false,
           "enableDisclaimerPolicy": false,
           "enableRefundPolicy": false,
           "enableShippingPolicy": false,
           "enablePrivacyPolicy": false
        }
      }
      """
    Then print last response
    And the response status code should be 200

  Scenario: Update checkout, endpoint permission
    Given I am not authenticated
    Given I use DB fixture "checkout/checkout/update/existing"
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}" with json:
      """
      {
        "default": false,
        "name": "New checkout name",
        "logo": "New checkout logo",
        "settings": {
          "phoneNumber": 123456789,
          "testingMode": false
        }
      }
      """
    Then print last response
    And the response status code should be 403
