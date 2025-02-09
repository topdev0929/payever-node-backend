Feature: trigger products synchronization
  Background:
    Given I remember as "businessId" following value:
    """
    "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1"
    """
    Given I remember as "integrationId" following value:
    """
    "cc15c66f-65d6-4f1f-aae8-481056bd837d"
    """
    Given I use DB fixture "trigger-products-synchronization/background"
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

  Scenario: Inward: check that task is created and event is emitted
    Given I use DB fixture "trigger-products-synchronization/inward-check-that-task-is-created-and-event-emitted"
    When I send a POST request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}/direction/inward/trigger"
    Then print last response
    Then the response status code should be 201

    Given I authenticate as a user with the following data:
      """

      {
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """
    When I send a GET request to "/api/admin/synchronization-tasks?businessIds={{businessId}}&integrationIds={{integrationId}}"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
      """
      {
        "documents": [
          {
            "businessId": "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1",
            "integration": "cc15c66f-65d6-4f1f-aae8-481056bd837d"
          }
        ]
      }
      """
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following ordered messages:
    """
    [
      {
        "name": "synchronizer.event.inner-sync.started",
        "payload": {
          "business": {
            "id": "{{businessId}}"
          },
          "payload": {},
          "synchronization": {
            "taskId": "*"
          }
        }
      }
    ]
    """

  Scenario: Outward: check that task is created and event is emitted
    Given I use DB fixture "trigger-products-synchronization/outward-check-that-task-is-created-and-event-emitted"
    When I send a POST request to "/api/synchronization/business/{{businessId}}/integration/{{integrationId}}/direction/outward/trigger"
    Then print last response
    Then the response status code should be 201

    Given I authenticate as a user with the following data:
    """
    {
      "roles": [
        {
          "name": "admin"
        }
      ]
    }
    """
    When I send a GET request to "/api/admin/synchronization-tasks?businessIds={{businessId}}&integrationIds={{integrationId}}"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
      """
      {
        "documents": [
          {
            "businessId": "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1",
            "integration": "cc15c66f-65d6-4f1f-aae8-481056bd837d",
            "direction": "outward"
          }
        ]
      }
      """

    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following ordered messages:
    """
    [
      {
        "name": "synchronizer.event.products.synchronize",
        "payload": {
          "business": {
            "id": "{{businessId}}"
          },
          "synchronization": {
            "taskId": "*"
          }
        }
      }
    ]
    """
