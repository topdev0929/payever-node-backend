Feature: Collection bus messages
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

  Scenario: Received Collection created method
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "products.event.collection.created",
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
                "action": "create-collection",
                "data":  {
                    "_id": "{{productId}}",
                    "businessUuid": "{{businessId}}"
                }
            }
        }
    ]
    """

  Scenario: Received Collection updated method
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "products.event.collection.updated",
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
                "action": "update-collection",
                "data":  {
                    "_id": "{{productId}}",
                    "businessUuid": "{{businessId}}"
                }
            }
        }
    ]
    """

  Scenario: Received Collection removed
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "products.event.collection.removed",
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
                "action": "remove-collection",
                "data":  {
                    "_id": "{{productId}}",
                    "businessUuid": "{{businessId}}"
                }
            }
        }
    ]
    """
