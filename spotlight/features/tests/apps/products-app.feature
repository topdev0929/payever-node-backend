Feature: Product
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
          "name": "products.event.product.created",
          "payload": {
            "uuid": "test-1",
            "businessUuid": "{{businessId}}",
            "title": "test"
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
          "name": "products.event.product.exported",
          "payload": {
            "uuid": "test-2",
            "businessUuid": "{{businessId}}",
            "title": "test"
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
          "name": "products.event.product.updated",
          "payload": {
            "uuid": "test-1",
            "businessUuid": "{{businessId}}",
            "title": "test-1"
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
          "name": "products.event.product.removed",
          "payload": {
            "uuid": "test-1",
            "businessUuid": "{{businessId}}"
          }
        }
        """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should not exist

