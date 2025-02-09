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
  Given I remember as "SyncId" following value:
    """
    "bc50772b-c31f-4fd1-b5b4-602f3c1bd02a"
    """

  Scenario: Received Product created method
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "third-party.event.third-party.connected",
        "payload": {
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
    Then model "Synchronization" with id "{{SyncId}}" should contain json:
      """
      {
        "_id": "{{SyncId}}",
        "isInwardEnabled": false,
        "isOutwardEnabled": false,
        "isInventorySyncEnabled": false
      }
      """

  Scenario: Received Product updated method
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "third-party.event.third-party.disconnected",
        "payload": {
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
    Then model "Synchronization" with id "{{SyncId}}" should contain json:
      """
      {
        "_id": "{{SyncId}}",
        "isInwardEnabled": false,
        "isOutwardEnabled": false,
        "isInventorySyncEnabled": false
      }
      """
