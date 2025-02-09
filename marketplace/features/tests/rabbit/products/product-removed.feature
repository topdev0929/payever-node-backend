Feature: When received message that product was removed from products service it should removes product subscriptions and send rabbit message
  Background:
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["marketplace-folder", []], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["marketplace-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["marketplace-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      { "arguments": ["marketplace-folder"], "result": [] }
      """
      Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "productId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "importedProductId" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """

  Scenario: Receive product removed message, product is the marketplace product
    Given I use DB fixture "products-bus/product-deleted"
    When I publish in RabbitMQ channel "async_events_marketplace_micro" message with json:
      """
      {
        "name": "products.event.product.removed",
        "payload": {
          "_id": "{{productId}}"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_marketplace_micro" channel
    And print RabbitMQ message list
    And model "Product" with id "{{productId}}" should not exist
    And model "ProductSubscription" found by following JSON should not exist:
      """
      {
        "marketplaceProduct": "{{productId}}"
      }
      """
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name": "marketplace.event.product-subscription.deleted",
          "payload": {
            "marketplaceProduct": {
              "id": "{{productId}}"
            },
            "business": {
              "id": "{{businessId}}"
            },
            "product": {
              "id": "cccccccc-cccc-cccc-cccc-cccccccccccc"
            }
          }
        }
      ]
      """

  Scenario: Receive product removed message, product is an imported product
    Given I use DB fixture "products-bus/product-deleted"
    When I publish in RabbitMQ channel "async_events_marketplace_micro" message with json:
      """
      {
        "name": "products.event.product.removed",
        "payload": {
          "_id": "{{importedProductId}}"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_marketplace_micro" channel
    And print RabbitMQ message list
    And model "ProductSubscription" found by following JSON should not exist:
      """
      {
        "productId": "{{importedProductId}}"
      }
      """
    And RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
          "name": "marketplace.event.product-subscription.deleted"
        }
      ]
      """
