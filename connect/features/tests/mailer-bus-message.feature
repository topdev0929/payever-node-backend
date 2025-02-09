@mailer-bus-message
Feature: Mailer bus messages
  Background:
    And I remember as "businessId" following value:
    """
    "d5b25c5c-3684-4ab7-a769-c95f4c0f7546"
    """
    And I remember as "integrationSubscriptionId" following value:
    """
    "76b88a77-98a9-4258-aa67-43a534f0978a"
    """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "service@payever.de",
        "roles": [
          {"name": "user", "permissions": []},
          {"name": "admin", "permissions": []}
        ]
      }
      """
    And I use DB fixture "integrations/businesses"
    And I use DB fixture "integrations/integration-subscriptions"

  Scenario: Received email send event
    When I publish in RabbitMQ channel "async_events_connect_micro" message with json:
    """
    {
      "name": "mailer.event.payment-mail.sent",
      "payload": {
        "id":"73f5491f-b3fc-4643-923f-c8673a158891",
        "businessId":"{{business1}}",
        "serviceEntityId":"{{integrationSubscriptionId}}",
        "templateName":"santander_contract_files_uploaded"
      }
    }
    """
    Then I process messages from RabbitMQ "async_events_connect_micro" channel
    Then look for model "IntegrationSubscription" by following JSON and remember as "subscription":
    """
    {
      "_id": "{{integrationSubscriptionId}}"
    }
    """
    Then print storage key "subscription"
    And model "IntegrationSubscription" with id "{{subscription._id}}" should contain json:
    """
    {
      "installed": true,
      "integration": "459891bb-78e3-413e-b874-acbdcaef85d6",
      "payload": {
        "application_sent": false,
        "documents": []
      }
    }
    """
    And model "IntegrationSubscription" with id "{{subscription._id}}" should not contain json:
    """
    {
      "installed": true,
      "integration": "459891bb-78e3-413e-b874-acbdcaef85d6",
      "payload": {
        "application_sent": true,
        "documents": [
          {
            "blobName": "0c94e131-f06e-4c6e-9191-422dd4ea9c4d-action_table.pdf",
            "fileName": "action_table.pdf",
            "name": "Company register extract or business registration",
            "type": "commercialRegisterExcerptFilename"
          }
        ]
      }
    }
    """
