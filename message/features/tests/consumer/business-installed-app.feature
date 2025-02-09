Feature: Handle app install/uninstall on business
  Background: constants
    Given I load constants from "features/fixtures/const.ts"
    Given I use DB fixture "business"

  Scenario: Receive installed app event
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "app-registry.event.application.installed",
        "payload": {
          "businessId": "{{ID_OF_BUSINESS_3}}",
          "code": "not-message"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ message list
    And model "Business" with id "{{ID_OF_BUSINESS_3}}" should contain json:
      """
      {
        "hasMessageApp": false
      }
      """
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "app-registry.event.application.installed",
        "payload": {
          "businessId": "{{ID_OF_BUSINESS_3}}",
          "code": "message"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ message list
    And model "Business" with id "{{ID_OF_BUSINESS_3}}" should contain json:
      """
      {
        "hasMessageApp": true
      }
      """

  Scenario: Receive uninstalled app event
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "app-registry.event.application.uninstalled",
        "payload": {
          "businessId": "{{ID_OF_BUSINESS_2}}",
          "code": "not-message"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ message list
    And model "Business" with id "{{ID_OF_BUSINESS_2}}" should contain json:
      """
      {
        "hasMessageApp": true
      }
      """
    When I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "app-registry.event.application.uninstalled",
        "payload": {
          "businessId": "{{ID_OF_BUSINESS_2}}",
          "code": "message"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ message list
    And model "Business" with id "{{ID_OF_BUSINESS_2}}" should contain json:
      """
      {
        "hasMessageApp": false
      }
      """
