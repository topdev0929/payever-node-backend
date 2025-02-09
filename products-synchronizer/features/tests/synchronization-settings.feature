Feature: Synchronization API
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
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@email.com",
      "roles": [
        {
          "name": "merchant",
          "permissions": [
            {
              "businessId": "{{businessId}}",
              "acls": []
            }
          ]
        }
      ]
    }
    """

  Scenario: Enable by business and integration
    Given I use DB fixture "collection/collection-events"
    When I send a PATCH request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}/sync/enable"
    Then print last response
    Then the response status code should be 200
    Then model "Synchronization" with id "{{SyncId}}" should contain json:
    """
    {
      "_id": "bc50772b-c31f-4fd1-b5b4-602f3c1bd02a",
      "isInwardEnabled": true,
      "isOutwardEnabled": true,
      "businessId": "{{businessId}}",
      "integration": "{{integrationId}}"
    }
    """

  Scenario: disable by business and integration
    Given I use DB fixture "collection/collection-events"
    When I send a PATCH request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}/sync/disable"
    Then print last response
    Then the response status code should be 200
    Then model "Synchronization" with id "{{SyncId}}" should contain json:
    """
    {
      "isInwardEnabled": false,
      "isOutwardEnabled": false,
      "isInventorySyncEnabled": false,
      "businessId": "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1",
      "integration": "cc15c66f-65d6-4f1f-aae8-481056bd837d",
      "_id": "*"
    }
    """

  Scenario: Enable by business and integration
    Given I use DB fixture "collection/collection-events"
    When I send a PATCH request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}/settings/enable"
    Then print last response
    Then the response status code should be 200
    Then model "Synchronization" with id "{{SyncId}}" should contain json:
    """
    {
      "_id": "bc50772b-c31f-4fd1-b5b4-602f3c1bd02a",
      "isInwardEnabled": true,
      "isOutwardEnabled": true,
      "businessId": "{{businessId}}",
      "integration": "{{integrationId}}"
    }
    """

  Scenario: disable by business and integration
    Given I use DB fixture "collection/collection-events"
    When I send a PATCH request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}/settings/disable"
    Then print last response
    Then the response status code should be 200
    Then model "Synchronization" with id "{{SyncId}}" should contain json:
    """
    {
      "isInwardEnabled": false,
      "isOutwardEnabled": false,
      "isInventorySyncEnabled": false,
      "businessId": "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1",
      "integration": "cc15c66f-65d6-4f1f-aae8-481056bd837d",
      "_id": "*"
    }
    """

  Scenario: Get settings by business and integration
    Given I use DB fixture "collection/collection-events"
    When I send a GET request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}/settings"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "isInwardEnabled": true,
      "isOutwardEnabled": true,
      "isInventorySyncEnabled": true
    }
    """

  Scenario: Get status by business and integration
    Given I use DB fixture "collection/collection-events"
    When I send a GET request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}/settings/status"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    true
    """

  Scenario: Enable by business and integration with direction
    Given I use DB fixture "collection/collection-events"
    When I send a PATCH request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}/direction/outward/enable"
    Then print last response
    Then the response status code should be 200
    Then model "Synchronization" with id "{{SyncId}}" should contain json:
    """
    {
      "_id": "bc50772b-c31f-4fd1-b5b4-602f3c1bd02a",
      "isOutwardEnabled": true,
      "businessId": "{{businessId}}",
      "integration": "{{integrationId}}"
    }
    """

  Scenario: disable by business and integration with direction
    Given I use DB fixture "collection/collection-events"
    When I send a PATCH request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}/direction/outward/disable"
    Then print last response
    Then the response status code should be 200
    Then model "Synchronization" with id "{{SyncId}}" should contain json:
    """
    {
      "isOutwardEnabled": false,
      "businessId": "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1",
      "integration": "cc15c66f-65d6-4f1f-aae8-481056bd837d",
      "_id": "*"
    }
    """

  Scenario: toggle by business and integration with direction
    Given I use DB fixture "collection/collection-events"
    When I send a PATCH request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}/direction/outward/toggle" with json:
    """
    {
      "value": false
    }
    """
    Then print last response
    Then the response status code should be 200
    Then model "Synchronization" with id "{{SyncId}}" should contain json:
    """
    {
      "isOutwardEnabled": false,
      "businessId": "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1",
      "integration": "cc15c66f-65d6-4f1f-aae8-481056bd837d",
      "_id": "*"
    }
    """

  Scenario: Enable by business and integration with direction
    Given I use DB fixture "collection/collection-events"
    When I send a PATCH request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}/direction/inward/enable"
    Then print last response
    Then the response status code should be 200
    Then model "Synchronization" with id "{{SyncId}}" should contain json:
    """
    {
      "_id": "bc50772b-c31f-4fd1-b5b4-602f3c1bd02a",
      "isInwardEnabled": true,
      "businessId": "{{businessId}}",
      "integration": "{{integrationId}}"
    }
    """

  Scenario: disable by business and integration with direction
    Given I use DB fixture "collection/collection-events"
    When I send a PATCH request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}/direction/inward/disable"
    Then print last response
    Then the response status code should be 200
    Then model "Synchronization" with id "{{SyncId}}" should contain json:
    """
    {
      "isInwardEnabled": false,
      "businessId": "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1",
      "integration": "cc15c66f-65d6-4f1f-aae8-481056bd837d",
      "_id": "*"
    }
    """

  Scenario: toggle by business and integration with direction
    Given I use DB fixture "collection/collection-events"
    When I send a PATCH request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}/direction/inward/toggle" with json:
    """
    {
      "value": false
    }
    """
    Then print last response
    Then the response status code should be 200
    Then model "Synchronization" with id "{{SyncId}}" should contain json:
    """
    {
      "isInwardEnabled": false,
      "businessId": "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1",
      "integration": "cc15c66f-65d6-4f1f-aae8-481056bd837d",
      "_id": "*"
    }
    """

  Scenario: Enable inventory by business and integration with direction
    Given I use DB fixture "collection/collection-events"
    When I send a PATCH request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}/inventory/enable"
    Then print last response
    Then the response status code should be 200
    Then model "Synchronization" with id "{{SyncId}}" should contain json:
    """
    {
      "_id": "bc50772b-c31f-4fd1-b5b4-602f3c1bd02a",
      "isInventorySyncEnabled": true,
      "businessId": "{{businessId}}",
      "integration": "{{integrationId}}"
    }
    """

  Scenario: disable inventory by business and integration with direction
    Given I use DB fixture "collection/collection-events"
    When I send a PATCH request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}/inventory/disable"
    Then print last response
    Then the response status code should be 200
    Then model "Synchronization" with id "{{SyncId}}" should contain json:
    """
    {
      "isInventorySyncEnabled": false,
      "businessId": "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1",
      "integration": "cc15c66f-65d6-4f1f-aae8-481056bd837d",
      "_id": "*"
    }
    """

  Scenario: toggle inventory by business and integration with direction
    Given I use DB fixture "collection/collection-events"
    When I send a PATCH request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}/inventory/toggle" with json:
    """
    {
      "value": false
    }
    """
    Then print last response
    Then the response status code should be 200
    Then model "Synchronization" with id "{{SyncId}}" should contain json:
    """
    {
      "isInventorySyncEnabled": false,
      "businessId": "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1",
      "integration": "cc15c66f-65d6-4f1f-aae8-481056bd837d",
      "_id": "*"
    }
    """

  Scenario: toggle inventory by business and integration with direction
    Given I use DB fixture "collection/collection-events"
    When I send a POST request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}/inventory/trigger"
    Then print last response
    Then the response status code should be 201
  Then RabbitMQ exchange "async_events" should contain following messages:
    """
    [
        {
            "name":"synchronizer.event.inventory.synchronize",
            "payload":{
                "business": {
                    "id": "{{businessId}}"
                },
                "payload": {}
            }
        }
    ]
    """
