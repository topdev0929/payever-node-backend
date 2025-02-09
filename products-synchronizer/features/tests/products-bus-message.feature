Feature: Product bus messages
  Background:
  Given I use DB fixture "collection/collection-events"
  Given I remember as "productId" following value:
    """
    "pppppppp-pppp-pppp-pppp-pppppppppppp"
    """
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

  Scenario: Received Product created method
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "products.event.product.created",
        "payload": {
            "_id": "{{productId}}",
            "businessUuid": "{{businessId}}"
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
                "action": "create-product",
                "data":  {
                    "_id": "{{productId}}",
                    "businessUuid": "{{businessId}}"
                }
            }
        }
    ]
    """

  Scenario: Received Product updated method
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "products.event.product.updated",
        "payload": {
            "_id": "{{productId}}",
            "businessUuid": "{{businessId}}"
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
                "action": "update-product",
                "data":  {
                    "_id": "{{productId}}",
                    "businessUuid": "{{businessId}}"
                }
            }
        }
    ]
    """

  Scenario: Received Product removed
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "products.event.product.removed",
        "payload": {
            "_id": "{{productId}}",
            "businessUuid": "{{businessId}}"
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
                "action": "remove-product",
                "data":  {
                    "_id": "{{productId}}",
                    "businessUuid": "{{businessId}}"
                }
            }
        }
    ]
    """

  Scenario: Received Product synchronization finished
  Given I use DB fixture "synchronization-tasks-api/get-two"
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "products.event.product-synchronization.finished",
        "payload": {
            "taskId": "{{SyncTaskId}}",
            "isFinished": true
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

  Scenario: Received Product synchronization succeeded
  Given I use DB fixture "synchronization-tasks-api/get-two"
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "products.event.product-synchronization.succeeded",
        "payload": {
            "business": {
                "id": "{{businessId}}"
            },
            "synchronizationTask": {
                "id": "{{SyncTaskId}}"
            },
            "product": {
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

  Scenario: Received Product synchronization failed
  Given I use DB fixture "synchronization-tasks-api/get-two"
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "products.event.product-synchronization.failed",
        "payload": {
            "business": {
                "id": "{{businessId}}"
            },
            "synchronizationTask": {
                "id": "{{SyncTaskTwoId}}"
            },
            "product": {
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
