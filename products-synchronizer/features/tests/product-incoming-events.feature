Feature: product incoming events
  Background:
    Given I use DB fixture "product-incoming-events/background"
    Given I remember as "businessId" following value:
    """
    "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1"
    """
    Given I remember as "integrationId" following value:
    """
    "cc15c66f-65d6-4f1f-aae8-481056bd837d"
    """
    Given I remember as "taskId" following value:
    """
    "210fcf8d-fd28-4565-8a9c-404deb1dcf42"
    """

  Scenario: check that task is updated
    Given I use DB fixture "product-incoming-events/check-that-task-is-updated"
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
      "name": "products.event.product.created",
      "payload": {
        "uuid": "91461d75-7c4e-4817-96a0-41d29260b2d7",
        "businessUuid": "{{businessId}}",
        "synchronization": {
          "taskId": "{{taskId}}"
        }
      }
    }
    """
    And I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
      "name": "products.event.product.updated",
      "payload": {
        "uuid": "75079a59-1824-4c30-850b-7b96d35b613e",
        "businessUuid": "{{businessId}}",
        "synchronization": {
          "taskId": "{{taskId}}"
        }
      }
    }
    """
    And I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
      "name": "products.event.product.removed",
      "payload": {
        "uuid": "cb3b68ab-04e1-4838-b001-837cb2f98ae7",
        "businessUuid": "{{businessId}}",
        "synchronization": {
          "taskId": "{{taskId}}"
        }
      }
    }
    """
    Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
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
    When I send a GET request to "/api/admin/synchronization-tasks/{{taskId}}/events"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
      """
      [
        {
          "itemId": "91461d75-7c4e-4817-96a0-41d29260b2d7"
        },
        {
          "itemId": "75079a59-1824-4c30-850b-7b96d35b613e"
        },
        {
          "itemId": "cb3b68ab-04e1-4838-b001-837cb2f98ae7"
        }
      ]
      """

    When I send a GET request to "/api/admin/synchronization-tasks?businessIds={{businessId}}&integrationIds={{integrationId}}"
    Then print last response
    Then the response status code should be 200
    Then the response should contain json:
      """
      {
        "documents": [
          {
            "itemsSynced": 3
          }
        ]
      }
      """

  Scenario: check that events are routed to integrations
    Given I use DB fixture "product-incoming-events/check-that-events-are-routed-to-integrations"
    When I publish in RabbitMQ channel "async_events_products_synchronizer_micro" message with json:
    """
    {
      "name": "products.event.product.created",
      "payload": {
        "uuid": "91461d75-7c4e-4817-96a0-41d29260b2d7",
        "businessUuid": "{{businessId}}",
        "synchronization": {
          "taskId": "{{taskId}}"
        }
      }
    }
    """
    Then I process messages from RabbitMQ "async_events_products_synchronizer_micro" channel
    Then print RabbitMQ exchange "async_events" message list
    Then RabbitMQ exchange "async_events" should contain following ordered messages:
    """
    [
      {
        "name":"synchronizer.event.action.call",
        "payload":{
          "business":{
            "id":"9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1"
          },
          "integration":{
            "name":"some-other-integration"
          },
          "action":"create-product",
          "data":{
            "synchronization":{
              "taskId": "*"
            },
            "uuid":"91461d75-7c4e-4817-96a0-41d29260b2d7",
            "businessUuid":"9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1"
          }
        }
      },
      {
        "name":"synchronizer.event.action.call",
        "payload":{
          "business":{
            "id":"9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1"
          },
          "integration":{
            "name":"some-integration"
          },

          "action":"create-product",
          "data":{
            "synchronization":{
              "taskId": "*"
            },
            "uuid":"91461d75-7c4e-4817-96a0-41d29260b2d7",
            "businessUuid":"9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1"
          }
        }
      }
    ]
    """
