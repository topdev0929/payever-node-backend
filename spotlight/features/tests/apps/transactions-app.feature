Feature: Transaction
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
          {}
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
          "name": "transactions.event.payment.paid",
          "payload": {
            "id": "test-1",
            "business": {
              "id": "{{businessId}}"
            },
            "customer": {
              "name": "test"
            },
            "reference": "123",
            "amount": 40
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should contain json:
      """
      {
        "title": 123,
        "description": "test"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "transactions.event.payment.export",
          "payload": {
            "id": "test-2",
            "business": {
              "id": "{{businessId}}"
            },
            "customer": {
              "name": "test"
            },
            "reference": "123",
            "amount": 40
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-2" should contain json:
      """
      {
        "title": "123",
        "description": "test"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
        """
        {
          "name": "transactions.event.payment.removed",
          "payload": {
            "id": "test-1",
            "business": {
              "id": "{{businessId}}"
            }
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should not exist

