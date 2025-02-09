Feature: Create products
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "productId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
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

  Scenario: Received create product request, no integration enabled
    Given I use DB fixture "products/create-product-no-integrations"
    When I send a POST request to "/api/products/{{businessId}}" with json:
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
        "businessId": "{{businessId}}"
      }
      """

  Scenario: Received create product request, integrations enabled
    Given I use DB fixture "products/create-product-integrations-enabled"
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
          "body": "{\"amount\":100,\"business\":{\"id\":\"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb\"},\"currency\":\"EUR\",\"id\":\"*\",\"product\":{\"id\":\"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa\",\"title\":\"Some product\"}}"

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
          "body": "{\"amount\":100,\"business\":{\"id\":\"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb\"},\"currency\":\"EUR\",\"id\":\"*\",\"product\":{\"id\":\"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa\",\"title\":\"Some product\"}}"
        },
        "response": {
          "status": 200,
          "body": ""
        }
      }
      """
    When I send a POST request to "/api/products/{{businessId}}" with json:
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
    And axios mocks should be called

  Scenario: Received create product request, product already exists
    Given I use DB fixture "products/create-product-already-exists"
    When I send a POST request to "/api/products/{{businessId}}" with json:
      """
      {
        "_id": "{{productId}}",
        "price": 1000,
        "title": "Some new product",
        "image": "http://some-image-url.com/test.jpg"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "price": 1000,
        "image": "http://some-image-url.com/test.jpg",
        "title": "Some new product"
      }
      """
