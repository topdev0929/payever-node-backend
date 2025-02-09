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

  Scenario: Get by business and integration
    Given I use DB fixture "collection/collection-events"
    When I send a GET request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "_id": "bc50772b-c31f-4fd1-b5b4-602f3c1bd02a",
      "isInwardEnabled": true,
      "isOutwardEnabled": true,
      "businessId": "{{businessId}}",
      "integration": "{{integrationId}}"
    }
    """

  Scenario: Put by business and integration
    Given I use DB fixture "collection/sync"
    When I send a PUT request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
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

  Scenario: Delete by business and integration
    Given I use DB fixture "collection/collection-events"
    When I send a DELETE request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
      "deletedCount": 1
    }
    """

  Scenario: connect by business and integration
    Given I use DB fixture "collection/collection-events"
    When I send a PATCH request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}/connect"
    Then print last response
    Then the response status code should be 200
    Then model "Synchronization" with id "{{SyncId}}" should contain json:
      """
      {
        "_id": "{{SyncId}}",
        "isInwardEnabled": false,
        "isOutwardEnabled": false,
        "isInventorySyncEnabled": false
      }
      """

  Scenario: Disconnect by business and integration
    Given I use DB fixture "collection/collection-events"
    When I send a PATCH request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}/disconnect"
    Then print last response
    Then the response status code should be 200
    Then model "Synchronization" with id "{{SyncId}}" should contain json:
      """
      {
        "_id": "{{SyncId}}",
        "isInwardEnabled": false,
        "isOutwardEnabled": false,
        "isInventorySyncEnabled": false
      }
      """
