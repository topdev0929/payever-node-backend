Feature: availability inventory
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "productId" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    Given I remember as "inventorySku" following value:
      """
      "testSku"
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

  Scenario: Get inventory by sku
    Given I use DB fixture "inventory/get-inventory-by-business"
    When I send a GET request to "/api/business/{{businessId}}/inventory/sku/testSku_1/stock"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
     11
    """

  Scenario: Get inventory by sku
    Given I use DB fixture "inventory/get-inventory-by-business"
    When I send a POST request to "/api/business/{{businessId}}/inventory/sku/stock" with json:
    """
    {
      "skus": ["testSku_1"]
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
      {
        "testSku_1": 11
      }
    """
