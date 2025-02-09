Feature: Create Remove applications
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "applicationId" following value:
      """
      "b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1"
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

  Scenario: Receive application create message
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["builder-application-theme-folder", []], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["builder-application-theme-folder", []], "result": [] }
      """
    Given I use DB fixture "business/exist-business"
    Given I use DB fixture "application/default-theme"
    When I publish in RabbitMQ channel "async_events_builder_application_micro" message with json:
      """
      {
        "name": "applications.event.application.created",
        "payload": {
          "id": "{{applicationId}}",
          "business": {
            "id": "{{businessId}}"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_builder_application_micro" channel
    And print RabbitMQ message list
    And model "Application" with id "{{applicationId}}" should contain json:
      """
      {
        "_id": "{{applicationId}}",
        "business": "{{businessId}}"
      }
      """
    And look for model "Theme" by following JSON and remember as "userTheme":
    """
    {
      "type": "application"
    }
    """
    And stored value "userTheme" should contain json:
    """
    {
      "_id": "*",
      "type": "application"
    }
    """

  Scenario: Receive application update message
    Given I use DB fixture "application/exist-application"
    When I publish in RabbitMQ channel "async_events_builder_application_micro" message with json:
      """
      {
        "name": "applications.event.application.updated",
        "payload": {
          "id": "{{applicationId}}",
          "title": "updated title",
          "business": {
            "id": "{{businessId}}"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_builder_application_micro" channel
    And print RabbitMQ message list
    And model "Application" with id "{{applicationId}}" should contain json:
      """
      {
        "_id": "{{applicationId}}",
        "title": "updated title",
        "business": "{{businessId}}"
      }
      """

  Scenario: Receive application update message non existing application
    When I publish in RabbitMQ channel "async_events_builder_application_micro" message with json:
      """
      {
        "name": "applications.event.application.updated",
        "payload": {
          "id": "{{applicationId}}",
          "title": "updated title",
          "business": {
            "id": "{{businessId}}"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_builder_application_micro" channel
    And print RabbitMQ message list
    And model "Application" with id "{{applicationId}}" should contain json:
      """
      {
        "_id": "{{applicationId}}",
        "title": "updated title",
        "business": "{{businessId}}"
      }
      """

  Scenario: Receive application removed message
    Given I use DB fixture "application/exist-application"
    When I publish in RabbitMQ channel "async_events_builder_application_micro" message with json:
      """
      {
        "name": "applications.event.application.removed",
        "payload": {
          "id": "{{applicationId}}"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_builder_application_micro" channel
    And print RabbitMQ message list
    And model "Application" with id "{{applicationId}}" should not exist

  Scenario: Receive application export message, already existing
    Given I use DB fixture "application/exist-application"
    When I publish in RabbitMQ channel "async_events_builder_application_micro" message with json:
      """
      {
        "name": "applications.event.application.export",
        "payload": {
          "id": "{{applicationId}}",
          "title": "updated title",
          "business": {
            "id": "{{businessId}}"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_builder_application_micro" channel
    And print RabbitMQ message list
    And model "Application" with id "{{applicationId}}" should contain json:
      """
      {
        "_id": "{{applicationId}}",
        "title": "updated title",
        "business": "{{businessId}}"
      }
      """

  Scenario: Receive application export message
    When I publish in RabbitMQ channel "async_events_builder_application_micro" message with json:
      """
      {
        "name": "applications.event.application.export",
        "payload": {
          "id": "{{applicationId}}",
          "title": "updated title",
          "business": {
            "id": "{{businessId}}"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_builder_application_micro" channel
    And print RabbitMQ message list
    And model "Application" with id "{{applicationId}}" should contain json:
      """
      {
        "_id": "{{applicationId}}",
        "title": "updated title",
        "business": "{{businessId}}"
      }
      """
