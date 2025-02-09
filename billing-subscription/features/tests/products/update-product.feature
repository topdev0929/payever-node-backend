Feature: Update products
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "productId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "planId1" following value:
      """
        "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    Given I remember as "planId2" following value:
      """
        "ffffffff-ffff-ffff-ffff-ffffffffffff"
      """
    Given I remember as "stripeConnectionId" following value:
      """
        "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"
      """
    Given I remember as "paypalConnectionId" following value:
      """
        "dddddddd-dddd-dddd-dddd-dddddddddddd"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
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

  Scenario: Received update product request, no integration enabled
    Given I use DB fixture "products/update-product-no-integrations"
    When I send a POST request to "/api/products/{{businessId}}/{{productId}}" with json:
      """
      {
        "_id": "{{productId}}",
        "price": 100,
        "title": "Some product",
        "image": "http://some-image-url.com/test.jpg"
      }
      """
    Then print last response
    And the response status code should be 200
    And model "Product" with id "{{productId}}" should contain json:
      """
      {
        "price": 100,
        "title": "Some product",
        "businessId": "{{businessId}}",
        "image": "http://some-image-url.com/test.jpg"
      }
      """


  Scenario: Received update product request, integrations enabled
    Given I use DB fixture "products/update-product-integrations-enabled"
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "http://third-party.service/api/business/{{businessId}}/connection/{{stripeConnectionId}}/action/plan-delete",
          "headers": {
            "Authorization": "*",
            "User-Agent": "Billing Subscriptions"
          },
          "body": "{\"id\":\"{{planId1}}\",\"product\":{\"id\":\"{{productId}}\"}}"
        },
        "response": {
          "status": 200,
          "body": ""
        }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "http://third-party.service/api/business/{{businessId}}/connection/{{paypalConnectionId}}/action/plan-delete",
          "headers": {
            "Authorization": "*",
            "User-Agent": "Billing Subscriptions"
          },
          "body": "{\"id\":\"{{planId2}}\",\"product\":{\"id\":\"{{productId}}\"}}"
        },
        "response": {
          "status": 200,
          "body": ""
        }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "http://third-party.service/api/business/{{businessId}}/connection/{{stripeConnectionId}}/action/plan-create",
          "headers": {
            "Authorization": "*",
            "User-Agent": "Billing Subscriptions"
          },
          "body": "{\"amount\":100,\"business\":{\"id\":\"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb\"},\"currency\":\"EUR\",\"id\":\"*\",\"product\":{\"id\":\"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa\",\"title\":\"product\"}}"

        },
        "response": {
          "status": 200,
          "body": ""
        }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "http://third-party.service/api/business/{{businessId}}/connection/{{paypalConnectionId}}/action/plan-create",
          "headers": {
            "Authorization": "*",
            "User-Agent": "Billing Subscriptions"
          },
          "body": "{\"amount\":100,\"business\":{\"id\":\"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb\"},\"currency\":\"EUR\",\"id\":\"*\",\"product\":{\"id\":\"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa\",\"title\":\"product\"}}"

        },
        "response": {
          "status": 200,
          "body": ""
        }
      }
      """
    When I send a POST request to "/api/products/{{businessId}}/{{productId}}" with json:
      """
      {
        "_id": "{{productId}}",
        "price": 100,
        "title": "Some product",
        "image": "http://some-image-url.com/test.jpg"
      }
      """
    Then print last response
    And the response status code should be 200
    And model "Product" with id "{{productId}}" should contain json:
      """
      {
        "price": 100,
        "title": "Some product",
        "businessId": "{{businessId}}",
        "image": "http://some-image-url.com/test.jpg"
      }
      """
    And axios mocks should be called

  Scenario: Received enable update request, billing plan shouldn't change
    Given I use DB fixture "products/update-product-integrations-enabled"
    When I send a POST request to "/api/products/{{businessId}}/{{productId}}" with json:
      """
      {
        "_id": "{{productId}}",
        "price": 100,
        "title": "Some product",
        "image": "http://some-image-url.com/test.jpg"
      }
      """
    Then print last response
    And the response status code should be 200
