Feature: Create business and sample product
  Background:
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "products",
          {}
         ],
        "result": {}
      }
      """

  Scenario: slug populated
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
    """
      {
        "name": "product.event.slug.populated",
        "payload":{
          "test": "test"
        }
      }
    """
