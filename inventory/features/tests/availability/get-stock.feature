Feature: Should return inventory if it is exists
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

  Scenario: Get stock by sku, anonymous
    Given I am not authenticated
    And I use DB fixture "inventory/get-inventory-by-sku"
    When I send a GET request to "/api/business/{{businessId}}/inventory/sku/{{inventorySku}}/stock"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      20
      """
