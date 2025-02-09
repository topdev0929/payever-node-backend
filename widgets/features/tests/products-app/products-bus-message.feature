Feature: Handle products bus message events

  Scenario: campaign created
    Given I remember as "businessId" following value:
    """
    "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99"
    """
    Given I remember as "productId" following value:
    """
    "77a41779-60ad-4725-a9c0-29fd506dfe0"
    """
    Given I use DB fixture "business/existing-widgets"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "products.event.product.created",
      "payload": {
        "uuid": "{{productId}}",
        "businessUuid": "{{businessId}}",
        "identifier": "string",
        "title": "string",
        "salePrice": 11,
        "price": 12,
        "images": ["url"],
        "createdAt": "2021-04-01T13:58:29.670Z"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And look for model "BusinessProductAggregate" by following JSON and remember as "data":
    """
    {
      "id": "{{productId}}"
    }
    """
    And print storage key "data"
    And stored value "data" should contain json:
    """
    {
      "id": "{{productId}}",
      "businessId": "{{businessId}}"
    }
    """

  Scenario: product updated
    Given I remember as "businessId" following value:
    """
    "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99"
    """
    Given I remember as "productId" following value:
    """
    "77a41779-60ad-4725-a9c0-29fd506dfe1"
    """
    Given I use DB fixture "business/existing-widgets"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "products.event.product.updated",
      "payload": {
        "uuid": "{{productId}}",
        "businessUuid": "{{businessId}}",
        "identifier": "string",
        "title": "string",
        "salePrice": 11,
        "price": 12,
        "images": ["url"],
        "createdAt": "2021-04-01T13:58:29.670Z"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And look for model "BusinessProductAggregate" by following JSON and remember as "data":
    """
    {
      "id": "{{productId}}"
    }
    """
    And print storage key "data"
    And stored value "data" should contain json:
    """
    {
      "id": "{{productId}}",
      "businessId": "{{businessId}}"
    }
    """

  Scenario: product removed
    Given I remember as "businessId" following value:
    """
    "3b8e9196-ccaa-4863-8f1e-19c18f2e4b99"
    """
    Given I remember as "productId" following value:
    """
    "77a41779-60ad-4725-a9c0-29fd506dfe1"
    """
    Given I use DB fixture "business/existing-widgets"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
    """
    {
      "name": "products.event.product.removed",
      "payload": {
        "uuid": "{{productId}}",
        "businessUuid": "{{businessId}}",
        "identifier": "string",
        "title": "string",
        "salePrice": 11,
        "price": 12,
        "images": ["url"],
        "createdAt": "2021-04-01T13:58:29.670Z"
      }
    }
    """
    And process messages from RabbitMQ "async_events_widgets_micro" channel
    And model "BusinessProductAggregate" with id "{{productId}}" should not contain json:
    """
    {
      "_id": "{{productId}}",
      "businessId": "{{businessId}}"
    }
    """
