Feature: Subscriptions
  Background:
    Given I remember as "businessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
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
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "spotlight",
          {
            "businessId": "{{businessId}}"
          }
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "spotlight",
          {}
         ],
        "result": {}
      }
      """

  Scenario: CRUD
    Given I use DB fixture "business"
    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "subscriptions.event.subscription.created",
          "payload": {
            "id": "test-1",
            "business": {
              "id": "{{businessId}}"
            },
            "name": "note"
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should contain json:
      """
      {
        "_id": "test-1",
        "title": "note"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "subscriptions.event.subscription.export",
          "payload": {
            "id": "test-2",
            "business": {
              "id": "{{businessId}}"
            },
            "name": "note"
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-2" should contain json:
      """
      {
        "_id": "test-2",
        "title": "note"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "subscriptions.event.subscription.updated",
          "payload": {
            "id": "test-1",
            "business": {
              "id": "{{businessId}}"
            },
            "name": "note-1"
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should contain json:
      """
      {
        "title": "note-1"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "subscriptions.event.subscription.removed",
          "payload": {
            "id": "test-1",
            "business": {
              "id": "{{businessId}}"
            },
            "name": "note-1"
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should not exist

