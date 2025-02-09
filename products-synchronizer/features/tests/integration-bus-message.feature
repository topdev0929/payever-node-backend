Feature: Integration bus messages
  Background:
  Given I remember as "integrationId" following value:
    """
    "cc15c66f-65d6-4f1f-aae8-481056bd837d"
    """
  Given I remember as "businessId" following value:
    """
    "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1"
    """
  Given I remember as "SyncId" following value:
    """
    "bc50772b-c31f-4fd1-b5b4-602f3c1bd02a"
    """

  Scenario: Received Integration enabled method
  Given I use DB fixture "integration/integration-events"
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "connect.event.third-party.enabled",
        "payload": {
            "name": "test",
            "businessId": "{{businessId}}"
        }
    }
    """
  Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
    Then model "Synchronization" with id "{{SyncId}}" should contain json:
      """
      {
        "_id": "{{SyncId}}"
      }
      """

  Scenario: Received Integration diabled method
  Given I use DB fixture "integration/integration-events"
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "connect.event.third-party.disabled",
        "payload": {
            "name": "test",
            "businessId": "{{businessId}}"
        }
    }
    """
    Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
    Then model "Synchronization" with id "{{SyncId}}" should not contain json:
      """
      {
        "_id": "{{SyncId}}"
      }
      """

  Scenario: Received Integration updatesettings
  Given I use DB fixture "integration/integration-events"
  When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
        "name": "connect.event.third-party.updatesettings",
        "payload": {
            "name": "test",
            "businessId": "{{businessId}}",
            "isInwardEnabled": true,
            "isOutwardEnabled": true,
            "isInventorySyncEnabled": true
        }
    }
    """
  Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
    Then model "Synchronization" with id "{{SyncId}}" should contain json:
      """
      {
        "_id": "{{SyncId}}",
        "isInwardEnabled": true,
        "isOutwardEnabled": true,
        "isInventorySyncEnabled": true
      }
      """
