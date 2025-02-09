Feature: TP Product bus messages
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
        "name": "third-party.event.product.created",
        "payload": {
            "data":  {
                "_id": "{{productId}}",
                "businessUuid": "{{businessId}}"
            },
            "business": {
                "id": "{{businessId}}"
            },
            "integration": {
                "name": "test"
            }
        }
    }
    """
  Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
  Then RabbitMQ exchange "async_events" should contain following messages:
    """
    [
        {
            "name":"synchronizer.event.outer-product.created",
            "payload":{
                "business": {
                    "id": "{{businessId}}"
                },
                "payload":  {
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
        "name": "third-party.event.product.updated",
        "payload": {
            "data":  {
                "_id": "{{productId}}",
                "businessUuid": "{{businessId}}"
            },
            "business": {
                "id": "{{businessId}}"
            },
            "integration": {
                "name": "test"
            }
        }
    }
    """
  Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
  Then RabbitMQ exchange "async_events" should contain following messages:
    """
    [
        {
            "name":"synchronizer.event.outer-product.updated",
            "payload":{
                "business": {
                    "id": "{{businessId}}"
                },
                "payload":  {
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
        "name": "third-party.event.product.removed",
        "payload": {
            "business": {
                "id": "{{businessId}}"
            },
            "integration": {
                "name": "test"
            },
            "data":  {
                "_id": "{{productId}}",
                "businessUuid": "{{businessId}}"
            }
        }
    }
    """
  Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
  Then RabbitMQ exchange "async_events" should contain following messages:
    """
    [
        {
            "name":"synchronizer.event.outer-product.removed",
            "payload":{
                "business": {
                    "id": "{{businessId}}"
                },
                "payload":  {
                    "_id": "{{productId}}",
                    "businessUuid": "{{businessId}}"
                }
            }
        }
    ]
    """

  Scenario: Received Product upserted succeeded
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "third-party.event.product.upserted",
        "payload": {
            "business": {
                "id": "{{businessId}}"
            },
            "integration": {
                "name": "test"
            },
            "data":  [{
                "_id": "{{productId}}",
                "businessUuid": "{{businessId}}"
            }],
            "synchronization": {},
            "routingKey": "123"
        }
    }
    """
  Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
  And print RabbitMQ exchange "async_events" message list
  Then RabbitMQ exchange "async_events" should contain following messages:
    """
    [
        {
            "name":"synchronizer.event.outer-products.upserted.static",
            "payload":{
                "business": {
                    "id": "{{businessId}}"
                },
                "payload":  [{
                    "_id": "{{productId}}",
                    "businessUuid": "{{businessId}}"
                }],
                "synchronization": {}
            }
        }
    ]
    """
