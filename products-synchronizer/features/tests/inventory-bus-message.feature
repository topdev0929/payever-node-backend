Feature: Inventory bus messages
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

  Scenario: Received order created
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "inventory.event.order.created",
        "payload": {
            "business": {
                "id": "{{businessId}}"
            },
            "order": {
                "flow": "FLOW_ID",
                "transaction": "TRANSACTION_ID",
                "reservations": []
            }
        }
    }
    """
  Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
  Then RabbitMQ exchange "async_events" should contain following messages:
    """
    [
        {
            "name":"synchronizer.event.action.call",
            "payload":{
                "business": {
                    "id": "{{businessId}}"
                },
                "integration": {
                    "name": "test"
                },
                "action": "order-created",
                "data":  {
                    "flow": "FLOW_ID",
                    "transaction": "TRANSACTION_ID",
                    "reservations": []
                }
            }
        }
    ]
    """

  Scenario: Received Inventory added
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "inventory.event.stock.added",
        "payload": {
            "business": {
                "id": "{{businessId}}"
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
            "name":"synchronizer.event.action.call",
            "payload":{
                "business": {
                    "id": "{{businessId}}"
                },
                "integration": {
                    "name": "test"
                },
                "action": "add-inventory",
                "data":  {
                    "quantity": 5,
                    "sku": "SKU_123",
                    "stock": 123
                }
            }
        }
    ]
    """

  Scenario: Received Inventory subtracted
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "inventory.event.stock.subtracted",
        "payload": {
            "business": {
                "id": "{{businessId}}"
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
            "name":"synchronizer.event.action.call",
            "payload":{
                "business": {
                    "id": "{{businessId}}"
                },
                "integration": {
                    "name": "test"
                },
                "action": "subtract-inventory",
                "data":  {
                    "quantity": 5,
                    "sku": "SKU_123",
                    "stock": 123
                }
            }
        }
    ]
    """

  Scenario: Received Inventory synchronize
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "inventory.event.stock.synchronize",
        "payload": {
            "business": {
                "id": "{{businessId}}"
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
            "name":"synchronizer.event.action.call",
            "payload":{
                "business": {
                    "id": "{{businessId}}"
                },
                "integration": {
                    "name": "test"
                },
                "action": "set-inventory",
                "data":  {
                    "sku": "SKU_123",
                    "stock": 123
                }
            }
        }
    ]
    """

  Scenario: Received Inventory synchronization succeeded
  Given I use DB fixture "synchronization-tasks-api/get"
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "inventory.event.inventory-synchronization.succeeded",
        "payload": {
            "business": {
                "id": "{{businessId}}"
            },
            "synchronizationTask": {
                "id": "{{SyncTaskId}}"
            },
            "inventory": {
                "sku": "SKU_123"
            }
        }
    }
    """
  Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
    Then model "SynchronizationTask" with id "{{SyncTaskId}}" should contain json:
      """
      {
        "_id": "{{SyncTaskId}}",
        "status": "success"
      }
      """

  Scenario: Received Inventory synchronization failed
  Given I use DB fixture "synchronization-tasks-api/get"
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "inventory.event.inventory-synchronization.failed",
        "payload": {
            "business": {
                "id": "{{businessId}}"
            },
            "synchronizationTask": {
                "id": "{{SyncTaskTwoId}}"
            },
            "inventory": {
                "sku": "SKU_123"
            },
            "errorMessage": "error"
        }
    }
    """
  Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
    Then model "SynchronizationTask" with id "{{SyncTaskTwoId}}" should contain json:
      """
      {
        "_id": "{{SyncTaskTwoId}}",
        "status": "success"
      }
      """
