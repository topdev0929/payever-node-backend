Feature: TP Inventory bus messages
  Background:
  Given I use DB fixture "collection/collection-events"
  Given I remember as "businessId" following value:
    """
    "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1"
    """
  Given I remember as "SyncTaskId" following value:
    """
    "210fcf8d-fd28-4565-8a9c-404deb1dcf42"
    """
  Given I remember as "SyncTaskTwoId" following value:
    """
    "ffab3970-e2ee-44a6-95c5-a2d75193da58"
    """

  Scenario: Received Inventory added
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "third-party.event.stock.added",
        "payload": {
            "business": {
                "id": "{{businessId}}"
            },
            "integration": {
                "name": "test"
            },
            "quantity": 5,
            "sku": "SKU_123",
            "stock": 123
        }
    }
    """
  Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
  Then RabbitMQ exchange "async_events" should contain following messages:
    """
    [
        {
            "name":"synchronizer.event.outer-stock.added",
            "payload":{
                "business": {
                    "id": "{{businessId}}"
                },
                "quantity": 5,
                "sku": "SKU_123",
                "stock": 123
            }
        }
    ]
    """

  Scenario: Received Inventory subtracted
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "third-party.event.stock.subtracted",
        "payload": {
            "business": {
                "id": "{{businessId}}"
            },
            "integration": {
                "name": "test"
            },
            "quantity": 5,
            "sku": "SKU_123",
            "stock": 123
        }
    }
    """
  Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
  Then RabbitMQ exchange "async_events" should contain following messages:
    """
    [
        {
            "name":"synchronizer.event.outer-stock.subtracted",
            "payload":{
                "business": {
                    "id": "{{businessId}}"
                },
                "quantity": 5,
                "sku": "SKU_123",
                "stock": 123
            }
        }
    ]
    """

  Scenario: Received Inventory created
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "third-party.event.stock.created",
        "payload": {
            "business": {
                "id": "{{businessId}}"
            },
            "integration": {
                "name": "test"
            },
            "inventories": [{
               "sku": "SKU_123",
               "stock": 123
            }]
        }
    }
    """
  Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
  Then RabbitMQ exchange "async_events" should contain following messages:
    """
    [
        {
            "name":"synchronizer.event.outer-stock.created",
            "payload": [{
                "business": {
                    "id": "{{businessId}}"
                },
                "integration": {
                    "name": "test"
                },
                "sku": "SKU_123",
                "stock": 123,
                "origin": "*"
            }]
        }
    ]
    """

  Scenario: Received Inventory upserted
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "third-party.event.stock.upserted",
        "payload": {
            "business": {
                "id": "{{businessId}}"
            },
            "integration": {
                "name": "test"
            },
            "inventories": [{
               "sku": "SKU_123",
               "stock": 123
            }]
        }
    }
    """
  Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
  Then RabbitMQ exchange "async_events" should contain following messages:
    """
    [
        {
            "name":"synchronizer.event.outer-stock.upserted",
            "payload": [{
                "business": {
                    "id": "{{businessId}}"
                },
                "integration": {
                    "name": "test"
                },
                "sku": "SKU_123",
                "stock": 123,
                "origin": "*"
            }]
        }
    ]
    """
