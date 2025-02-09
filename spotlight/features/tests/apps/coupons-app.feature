Feature: Coupons
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
        "name": "coupons.event.code.created",
        "payload": {
          "coupon": {
            "_id": "test-1",
            "businessId": "{{businessId}}",
            "name": "name",
            "description": "description"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should contain json:
      """
      {
        "title": "name",
        "description": "description"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
      """
      {
        "name": "coupons.event.code.exported",
        "payload": {
          "coupon": {
            "_id": "test-2",
            "businessId": "{{businessId}}",
            "name": "name",
            "description": "description"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-2" should contain json:
      """
      {
        "title": "name",
        "description": "description"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
      """
      {
        "name": "coupons.event.code.updated",
        "payload": {
          "coupon": {
            "_id": "test-1",
            "businessId": "{{businessId}}",
            "name": "name-1",
            "description": "description"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should contain json:
      """
      {
        "title": "name-1"
      }
      """

    When I publish in RabbitMQ channel "async_events_spotlight_micro" message with json:
      """
      {
        "name": "coupons.event.code.removed",
        "payload": {
          "coupon": {
            "_id": "test-1",
            "businessId": "{{businessId}}"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_spotlight_micro" channel
    And model "Spotlight" with id "test-1" should not exist

