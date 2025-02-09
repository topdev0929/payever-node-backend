Feature: Should return order if exists
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "orderId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
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

  Scenario: Get all orders by business, anonymous
    Given I am not authenticated
    And I use DB fixture "order/get-orders-by-business"
    When I send a GET request to "/api/business/{{businessId}}/order"
    Then print last response
    And the response status code should be 403

  Scenario: Get all orders by business
    Given I use DB fixture "order/get-orders-by-business"
    When I send a GET request to "/api/business/{{businessId}}/order"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      [
         {
           "reservations": [],
           "status": "*",
           "flow": "*",
           "transaction": "*",
           "businessId": "{{businessId}}"
         },
         {
           "reservations": [],
           "status": "*",
           "flow": "*",
           "transaction": "*",
           "businessId": "{{businessId}}"
         },
         {
           "reservations": [],
           "status": "*",
           "flow": "*",
           "transaction": "*",
           "businessId": "{{businessId}}"
         }
      ]
      """

  Scenario: Get all orders by business, anonymous
    Given I am not authenticated
    And I use DB fixture "order/get-orders-by-id"
    When I send a GET request to "/api/business/{{businessId}}/order/{{orderId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
         "reservations": "*",
         "status": "PERMANENT",
         "_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
         "flow": "*",
         "transaction": "*",
         "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      }
      """
