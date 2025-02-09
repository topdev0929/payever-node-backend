Feature: When received message that business was created and enable channel ads
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
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

  Scenario: Receive business create message
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      {
        "arguments": [
          "builder-application-theme-folder",
          []
        ],
        "result": []
      }
      """
    When I publish in RabbitMQ channel "async_events_builder_application_micro" message with json:
      """
      {
        "name": "users.event.business.created",
        "payload": {
          "_id": "{{businessId}}",
          "name": "Some business"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_builder_application_micro" channel
    And print RabbitMQ message list
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "name": "Some business"
      }
      """

  Scenario: Receive business exported message
    When I publish in RabbitMQ channel "async_events_builder_application_micro" message with json:
      """
      {
        "name": "users.event.business.export",
        "payload": {
          "_id": "{{businessId}}",
          "name": "Some business"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_builder_application_micro" channel
    And print RabbitMQ message list
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "name": "Some business"
      }
      """

  Scenario: Receive business updated message
    Given I use DB fixture "business/exist-business"
    When I publish in RabbitMQ channel "async_events_builder_application_micro" message with json:
      """
      {
        "name": "users.event.business.updated",
        "payload": {
          "_id": "{{businessId}}",
          "name": "New name business"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_builder_application_micro" channel
    And print RabbitMQ message list
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "name": "New name business"
      }
      """

  Scenario: Receive business removed message
    Given I use DB fixture "business/exist-business"
    When I publish in RabbitMQ channel "async_events_builder_application_micro" message with json:
      """
      {
        "name": "users.event.business.removed",
        "payload": {
          "_id": "{{businessId}}"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_builder_application_micro" channel
    And print RabbitMQ message list
    And model "Business" with id "{{businessId}}" should not exist
