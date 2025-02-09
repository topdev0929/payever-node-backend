Feature: Connect events processing
  Background: Constants
    Given I remember as "businessId" following value:
      """
      "9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1"
      """
    Given I remember as "integrationId" following value:
      """
      "314039c0-2b82-46cb-867f-234186399816"
      """
  
  Scenario: Third-party enabled
    Given I use DB fixture "partial/business"
    Given I use DB fixture "partial/integrations"
    When I publish in RabbitMQ channel "async_events_synchronizer_micro" message with json:
      """
      {
        "name": "connect.event.third-party.enabled",
        "payload": {
          "name": "external-contacts-storage",
          "category": "contacts-synchronization",
          "businessId": "{{businessId}}"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_synchronizer_micro" channel
    Then model "Synchronization" found by following JSON should exist:
      """
      {
        "businessId": "{{businessId}}",
        "integrationId": "{{integrationId}}"
      }
      """
  
  Scenario: Third-party disabled
    Given I use DB fixture "partial/business"
    Given I use DB fixture "partial/integrations"
    Given I use DB fixture "partial/synchronizations"
    When I publish in RabbitMQ channel "async_events_synchronizer_micro" message with json:
      """
      {
        "name": "connect.event.third-party.disabled",
        "payload": {
          "name": "external-contacts-storage",
          "category": "contacts-synchronization",
          "businessId": "{{businessId}}"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_synchronizer_micro" channel
    Then model "Synchronization" found by following JSON should not exist:
      """
      {
        "business": "{{businessId}}",
        "integration": "{{integrationId}}"
      }
      """

  Scenario: Third-party settings updated
    Given I use DB fixture "partial/business"
    Given I use DB fixture "partial/integrations"
    Given I use DB fixture "partial/synchronizations"
    When I publish in RabbitMQ channel "async_events_synchronizer_micro" message with json:
      """
      {
        "name": "connect.event.third-party.updatesettings",
        "payload": {
          "name": "external-contacts-storage",
          "category": "contacts-synchronization",
          "businessId": "{{businessId}}",
          "isInwardEnabled": true,
          "isOutwardEnabled": true
        }
      }
      """
    And I process messages from RabbitMQ "async_events_synchronizer_micro" channel
    Then model "Synchronization" found by following JSON should exist:
      """
      {
        "businessId": "{{businessId}}",
        "integrationId": "{{integrationId}}",
        "isInwardEnabled": true,
        "isOutwardEnabled": true,
        "lastSync": null
      }
      """