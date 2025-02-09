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
    When I send a POST request to "/api/business/{{businessId}}/checkout" with json:
      """
      {
        "default": false,
        "name": "test",
        "logo": "logo",
        "settings":{
          "callbacks": {
            "successUrl": "https://success.com/callback"
          },
          "enableCustomerAccount": false,
          "enablePayeverTerms": false,
          "enableLegalPolicy": false,
          "enableDisclaimerPolicy": false,
          "enableRefundPolicy": false,
          "enableShippingPolicy": false,
          "enablePrivacyPolicy": false,
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
          "callbacks": {
            "successUrl": "https://success.com/callback"
          },
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
            "callbacks": {
              "successUrl": "https://success.com/callback"
            },
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
          "callbacks": {
            "successUrl": "https://success.com/callback"
          },
          "enableCustomerAccount": false,
          "enablePayeverTerms": false,
          "enableLegalPolicy": false,
          "enableDisclaimerPolicy": false,
          "enableRefundPolicy": false,
          "enableShippingPolicy": false,
          "enablePrivacyPolicy": false,
          "phoneNumber": 123456789,
          "testingMode": false
        }
      }
      """
    Then print last response
    And the response status code should be 200
    Then model "Checkout" with id "{{checkoutId}}" should contain json:
      """
      {
        "name": "New checkout name",
        "logo": "New checkout logo",
        "settings": {
          "callbacks": {
            "successUrl": "https://success.com/callback"
          },
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
              "callbacks": {
                "successUrl": "https://success.com/callback"
              },
              "cspAllowedHosts":[],
              "testingMode":false,
              "phoneNumber":"123456789",
              "languages":[]
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
            "logo":"New checkout logo",
            "createdAt":"*",
            "updatedAt":"*",
            "__v":"*",
            "cspAllowedHosts":[]
          }
        }
      ]
      """
