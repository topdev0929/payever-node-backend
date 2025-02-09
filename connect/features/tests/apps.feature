Feature: Apps
  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "appId" following value:
      """
      "5985789c-7a2e-4959-a8a0-aaf3746965c4"
      """
    Given I remember as "business" following value:
      """
      {
        "id": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f",
        "name": "Some Business Name",
        "currency": "EUR",
        "country": "DE",
        "createdAt": "2019-11-08T08:27:18.286Z",
        "updatedAt": "2019-11-08T08:27:18.286Z"
      }
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
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


  Scenario: App Created
    When I publish in RabbitMQ channel "async_events_connect_micro" message with json:
      """
      {
        "name": "apps.event.app.created",
        "payload": {
          "_id": "{{appId}}",
          "category": "products",
          "title": "Facebook Integration",
          "key": "facebook",
          "connect": {
            "action": "/action",
            "form": "/form",
            "url": "https://reza.com"
          },
          "events": [
            "product.created",
            "product.updated",
            "product.deleted"
          ],
          "scopes": [
            "read_products"
          ],
          "createdAt": "2021-11-09T08:27:18.286Z",
          "updatedAt": "2021-11-09T08:27:18.286Z"
        }
      }
      """
    And process messages from RabbitMQ "async_events_connect_micro" channel
    Then model "Integration" with id "{{appId}}" should contain json:
      """
      {
        "_id": "{{appId}}",
        "category": "products",
        "displayOptions": {
          "title": "Facebook Integration"
        },
        "name": "facebook",
        "scopes": [
          "read_products"
        ]
      }
      """

  Scenario: Setup connect
    Given I use DB fixture "integrations/integration-create"
    When I publish in RabbitMQ channel "async_events_connect_micro" message with json:
      """
      {
        "name": "onboarding.event.setup.connect",
        "payload": {
          "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
          "integrations": ["my name -2"]
        }
      }
      """
    And process messages from RabbitMQ "async_events_connect_micro" channel
    Then I look for model "IntegrationSubscription" by following JSON and remember as "integrationSubscription":
      """
      {
        "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "integration": "22222222-2222-2222-2222-222222222222"
      }
      """
    And stored value "integrationSubscription" should contain json:
      """
      {
        "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "integration": "22222222-2222-2222-2222-222222222222",
        "installed": true
      }
      """
  Scenario: On onboarding setup connect integrations
    And I publish in RabbitMQ channel "async_events_connect_micro" message with json:
      """
      {
        "name": "onboarding.event.setup.connect",
        "payload": {
          "businessId": "{{businessId}}",
          "integrations": ["connect"]
        }
      }
      """
    When I process messages from RabbitMQ "async_events_connect_micro" channel
    And print RabbitMQ message list
    And look for model "PendingInstallation" by following JSON and remember as "pendingInstallation":
      """
      { "businessId": "{{businessId}}" }
      """
    And print storage key "pendingInstallation"
    And stored value "pendingInstallation" should contain json:
      """
      {
        "businessId": "{{businessId}}",
        "payload": {
          "businessId": "{{businessId}}",
          "integrations": ["connect"]
        }
      }
      """

  Scenario: App Updated
    When I publish in RabbitMQ channel "async_events_connect_micro" message with json:
      """
      {
        "name": "apps.event.app.updated",
        "payload": {
          "_id": "{{appId}}",
          "category": "products",
          "title": "Facebook Integration",
          "key": "facebook",
          "connect": {
            "action": "/action",
            "form": "/form",
            "url": "https://reza.com"
          },
          "events": [
            "product.created",
            "product.updated",
            "product.deleted"
          ],
          "createdAt": "2021-11-09T08:27:18.286Z",
          "updatedAt": "2021-11-09T08:27:18.286Z"
        }
      }
      """
    And process messages from RabbitMQ "async_events_connect_micro" channel
    Then model "Integration" with id "{{appId}}" should contain json:
      """
      {
        "_id": "{{appId}}",
        "category": "products",
        "displayOptions": {
          "title": "Facebook Integration"
        },
        "name": "facebook"
      }
      """
