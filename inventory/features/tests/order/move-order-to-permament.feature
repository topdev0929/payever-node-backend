Feature: Should move order to permanent
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "orderId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "flowId" following value:
      """
      "ffffffff-ffff-ffff-ffff-ffffffffffff"
      """
    Given I remember as "testSku" following value:
      """
      "test_sku"
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

  Scenario: Moving order to permanent, anonymous
    Given I am not authenticated
    And I use DB fixture "order/move-order-to-permanent"
    When I send a PATCH request to "/api/business/{{businessId}}/order/{{orderId}}/permanent"
    Then print last response
    And the response status code should be 403
    And look for model "Order" with id "{{orderId}}" and remember as "order"
    And stored value "order" should not contain json:
      """
        {
          "status": "PERMANENT"
        }
      """

  Scenario: Moving order to permanent
    Given I use DB fixture "order/move-order-to-permanent"
    When I send a PATCH request to "/api/business/{{businessId}}/order/{{orderId}}/permanent"
    Then print last response
    And the response status code should be 200
    And look for model "Order" with id "{{orderId}}" and remember as "order"
    And stored value "order" should contain json:
      """
        {
          "status": "PERMANENT"
        }
      """
