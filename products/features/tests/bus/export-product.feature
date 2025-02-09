Feature: Channel set API
  Background:
    Given I remember as "productId" following value:
      """
      "3799bb06-929a-11e9-b5a6-7200004fe4c0"
      """

  Scenario: Create new
    Given I use DB fixture "graphql/get-products/get-products"
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
      """
      {
        "name": "products.event.product.request.export",
        "payload": {
          "productId": "{{productId}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_products_micro" channel
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "products.event.product.exported",
        "payload": {
          "id": "3799bb06-929a-11e9-b5a6-7200004fe4c0"
        }
      }
    ]
    """
