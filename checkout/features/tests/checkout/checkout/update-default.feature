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

  Scenario: Update checkout making default
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
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/default"
    Then print last response
    And the response status code should be 200
    Then model "Checkout" with id "{{checkoutId}}" should contain json:
      """
      {
        "default": true
      }
      """
    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name":"checkout.event.checkout.updated",
          "payload":{
            "_id":"{{checkoutId}}",
            "default":true,
            "name":"Existing checkout name",
            "logo":"Existing checkout logo",
            "businessId":"{{businessId}}",
            "checkoutId":"{{checkoutId}}",
            "settings":{
              "cspAllowedHosts":[],
              "testingMode":false,
              "languages":"*"
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
            "__v":"*",
            "cspAllowedHosts":[]
          }
        }
      ]
      """

  Scenario: Update checkout making default between some amount checkouts
    Given I remember as "defaultCheckoutId" following value:
      """
      "49b19f50-48de-b3d2-ee1a-8d49b19f5054"
      """
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
    Given I use DB fixture "checkout/checkout/update/existing-default"
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/default"
    Then print last response
    And the response status code should be 200
    Then model "Checkout" with id "{{checkoutId}}" should contain json:
      """
      {
        "default": true
      }
      """
    And model "Checkout" with id "{{defaultCheckoutId}}" should contain json:
      """
      {
        "default": false
      }
      """
    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name":"checkout.event.checkout.updated",
          "payload":{
            "_id":"{{checkoutId}}",
            "default":true,
            "name":"Existing checkout name",
            "logo":"Existing checkout logo",
            "businessId":"{{businessId}}",
            "checkoutId":"{{checkoutId}}",
            "settings":{
              "cspAllowedHosts":[],
              "testingMode":false,
              "languages":"*"
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
            "__v":"*",
            "cspAllowedHosts":[]
          }
        }
      ]
      """

  Scenario: Update checkout, endpoint permission
    Given I am not authenticated
    Given I use DB fixture "checkout/checkout/update/existing-default"
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/{{checkoutId}}/default"
    Then print last response
    And the response status code should be 403
