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
    Given I remember as "nonExistingCheckoutId" following value:
      """
      "49b19f50-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I remember as "checkoutSubscriptionId" following value:
      """
      "b0a201a7-b01f-40c4-bfd0-339cfb8d0675"
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

  Scenario: Get by id
    Given I use DB fixture "checkout/checkout/get-by-id/existing"
    When I send a GET request to "/api/business/{{businessId}}/checkout/{{checkoutId}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "_id":"{{checkoutId}}",
        "businessId":"{{businessId}}",
        "name":"Checkout",
        "default":true,
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
      }
      """

  Scenario: Get by id not existing
    Given I use DB fixture "checkout/checkout/get-by-id/no-any"
    When I send a GET request to "/api/business/{{businessId}}/checkout/{{nonExistingCheckoutId}}"
    Then print last response
    Then the response status code should be 404
    And the response should contain json:
      """
      {
        "statusCode":404,
        "error":"Not Found",
        "message":"Checkout by {\"_id\":\"{{nonExistingCheckoutId}}\",\"businessId\":\"{{businessId}}\"} not found!"
      }
      """

  Scenario: Get by id, endpoint permission
    Given I am not authenticated
    Given I use DB fixture "checkout/checkout/get-by-id/existing"
    When I send a GET request to "/api/business/{{businessId}}/checkout/{{checkoutId}}"
    Then print last response
    Then the response status code should be 403
