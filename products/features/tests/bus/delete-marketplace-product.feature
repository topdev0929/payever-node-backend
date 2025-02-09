Feature: When product was deleted from marketplace, all cloned products must be deactivated
  Background:
    Given I remember as "businessId" following value:
    """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
    """
    Given I remember as "productId" following value:
    """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    """
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "{{businessId}}", "acls": []}]
      }]
    }
    """


  Scenario: Receive product subscription deleted from marketplace message
    Given I use DB fixture "marketplace-products/subscription-deleted"
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "product-category",
          {}
         ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "products-folder",
          {}
         ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "products-folder",
          {}
         ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "bulkIndex" with:
      """
      [
        {
          "arguments": [
            "products",
            []
          ],
          "result": {}
        }
      ]
      """
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
      """
      {
          "name": "marketplace.event.product-subscription.deleted",
          "payload": {
            "marketplaceProduct": {
              "id": "cccccccc-cccc-cccc-cccc-cccccccccccc"
            },
            "business": {
              "id": "{{businessId}}"
            },
            "product": {
              "id": "{{productId}}"
            }
          }
        }
      """
    Then I process messages from RabbitMQ "async_events_products_micro" channel
    And print RabbitMQ message list
    And model "Product" with id "{{productId}}" should contain json:
      """
      {
        "active": false
      }
      """
