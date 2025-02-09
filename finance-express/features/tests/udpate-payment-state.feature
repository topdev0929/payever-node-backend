@payment-state
Feature: Update widget payment state
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I remember as "widgetId" following value:
      """
        "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    And I remember as "widgetId2" following value:
      """
        "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"
      """
    Given I remember as "checkoutId" following value:
      """
        "2d873385-5c32-479c-a830-26de40bd4fd1"
      """
    Given I remember as "connectionId" following value:
      """
        "18100111-0ac0-4e0f-a4ec-ecfb24178ee5"
      """
    Given I remember as "integrationId" following value:
      """
        "18100111-0ac0-4e0f-a4ec-ecfb24178ee5"
      """
    And I use DB fixture "channel"
    And I authenticate as a user with the following data:
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

  Scenario: Update widgets payment state
    Given I use DB fixture "businesses"
    Given I use DB fixture "update-payment-state"
    When I publish in RabbitMQ channel "async_events_finance_express_micro" message with json:
    """
    {
      "name": "checkout.event.connection.installed",
      "payload": {
        "checkout": {
          "_id": "{{checkoutId}}"
        },
        "connection": {
          "_id": "{{connectionId}}",
          "businessId": "{{businessId}}",
          "integration": "{{integrationId}}"
        },
        "integration": {
          "name": "santander_installment"
        }
      }
    }
    """
    When I publish in RabbitMQ channel "async_events_finance_express_micro" message with json:
    """
    {
      "name": "checkout.event.connection.uninstalled",
      "payload": {
        "checkout": {
          "_id": "{{checkoutId}}"
        },
        "connection": {
          "_id": "{{connectionId}}",
          "businessId": "{{businessId}}",
          "integration": "{{integrationId}}"
        },
        "integration": {
          "name": "santander_installment_dk"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_finance_express_micro" channel
    And look for model "Widget" with id "{{widgetId}}" and remember as "data"
    And print storage key "data"
    And model "Widget" with id "{{widgetId}}" should contain json:
      """
      {
        "businessId": "{{businessId}}",
        "checkoutId": "{{checkoutId}}",
        "isVisible": true,
        "payments": [
           {
             "paymentMethod": "santander_installment",
             "enabled": true
           },
           {
             "paymentMethod": "santander_factoring_de"
           },
           {
             "paymentMethod": "santander_installment_dk",
             "enabled": false
           }
        ]
      }
      """
    And model "Widget" with id "{{widgetId2}}" should contain json:
      """
      {
        "businessId": "{{businessId}}",
        "checkoutId": "{{checkoutId}}",
        "isVisible": true,
        "payments": [
           {
             "paymentMethod": "santander_installment",
             "enabled": true
           },
           {
             "paymentMethod": "santander_factoring_de",
             "enabled": true
           },
           {
             "paymentMethod": "santander_installment_dk",
             "enabled": false
           }
        ]
      }
      """

  Scenario: Remove widgets payment option
    Given I use DB fixture "businesses"
    Given I use DB fixture "update-payment-state"
    When I publish in RabbitMQ channel "async_events_finance_express_micro" message with json:
    """
    {
      "name": "third-party.event.third-party.disconnected",
      "payload": {
        "authorizationId": "authorizationId",
        "business": {
          "id": "{{businessId}}"
        },
        "connection": {
          "id": "connectionId"
        },
        "integration": {
          "name": "santander_installment"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_finance_express_micro" channel
    And look for model "Widget" with id "{{widgetId}}" and remember as "data"
    And print storage key "data"
    And model "Widget" with id "{{widgetId}}" should contain json:
      """
      {
        "businessId": "{{businessId}}",
        "checkoutId": "{{checkoutId}}",
        "isVisible": true,
        "payments": [
           {
             "paymentMethod": "santander_factoring_de"
           },
           {
             "paymentMethod": "santander_installment_dk"
           }
        ]
      }
      """
    And model "Widget" with id "{{widgetId}}" should not contain json:
      """
      {
        "businessId": "{{businessId}}",
        "checkoutId": "{{checkoutId}}",
        "isVisible": true,
        "payments": [
           {
             "paymentMethod": "santander_installment"
           }
        ]
      }
      """
