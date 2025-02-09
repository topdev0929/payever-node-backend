Feature: Search shipping orders
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "transactionId" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    And I authenticate as a user with the following data:
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

  Scenario: Search shipping orders without filters
    Given I use DB fixture "shipping-orders/processed/search-list"
    When I send a GET request to "/api/business/{{businessId}}/shipping-orders/list"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        {
         "list": "*",
         "page": 1,
         "perPage": 10,
         "total": 3
       }
      """

  Scenario: Search shipping orders with plain field filter
    Given I use DB fixture "shipping-orders/processed/search-list"
    When I send a GET request to "/api/business/{{businessId}}/shipping-orders/list?filters[0][field]=transactionId&filters[0][condition]=is&filters[0][value]={{transactionId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        {
         "list": [
          {
            "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
            "transactionId": "cccccccc-cccc-cccc-cccc-cccccccccccc"
          }
         ],
         "page": 1,
         "perPage": 10,
         "total": 1
       }
      """

  Scenario: Search shipping orders with nested field filter
    Given I use DB fixture "shipping-orders/processed/search-list"
    When I send a GET request to "/api/business/{{businessId}}/shipping-orders/list?filters[0][field]=shippingItems.price&filters[0][condition]=greaterThan&filters[0][value]=10"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        {
         "list": [
          {
            "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
            "shippingItems": [
              {
                "name": "Shipped item name",
                "price": 999,
                "quantity": 100
              }
            ]
          }
         ],
         "page": 1,
         "perPage": 10,
         "total": 1
       }
      """
