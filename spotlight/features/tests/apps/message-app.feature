Feature: Message
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
          "name": "messages.event.widget-data.created",
          "payload": {
            "id": "test-1",
            "businessId": "{{businessId}}",
            "name": "test"
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should contain json:
      """
      {
        "title": "test"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "messages.event.widget-data.exported",
          "payload": {
            "id": "test-2",
            "businessId": "{{businessId}}",
            "name": "test"
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-2" should contain json:
      """
      {
        "title": "test"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "messages.event.widget-data.updated",
          "payload": {
            "id": "test-1",
            "businessId": "{{businessId}}",
            "name": "test-1"
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should contain json:
      """
      {
        "title": "test-1"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "messages.event.widget-data.deleted",
          "payload": {
            "id": "test-1",
            "businessId": "{{businessId}}"
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should not exist

