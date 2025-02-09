Feature: Connection API

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "integrationId" following value:
      """
      "bce8ef2c-e88c-4066-acb0-1154bb995efc"
      """
    Given I remember as "integrationName" following value:
      """
      "santander_factoring_de"
      """
    Given I remember as "connectionId" following value:
      """
      "4ca57652-6881-4b54-9c11-ce00c79fcb45"
      """
    Given I remember as "connectionName" following value:
      """
      "Connection One"
      """

  Scenario: Business Subscription of Payment Integration Installed
    Given I remember as "checkoutIdOne" following value:
      """
      "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I remember as "checkoutIdTwo" following value:
      """
      "184a8e77-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I use DB fixture "connection/third-party-auth-bus-message/third-party-auth-disabled/integration-of-payments-installed"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "third-party.event.third-party.disconnected",
        "payload": {
          "business": {
            "id": "{{businessId}}"
          },
          "integration": {
            "name": "{{integrationName}}"
          },
          "connection": {
            "id": "{{connectionId}}",
            "name": "{{connectionName}}"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then print database connection url
    Then model "Connection" with id "{{connectionId}}" should not exist
    Then model "Checkout" with id "{{checkoutIdOne}}" should contain json:
      """
      {
        "_id": "{{checkoutIdOne}}",
        "connections": []
      }
      """
    Then model "Checkout" with id "{{checkoutIdTwo}}" should contain json:
      """
      {
        "_id": "{{checkoutIdTwo}}",
        "connections": []
      }
      """

  Scenario: Business Subscription of Shipping Integration Installed
    Given I remember as "integrationId" following value:
      """
      "46dff89b-6190-4e55-bdc4-fa1888bda518"
      """
    Given I remember as "integrationName" following value:
      """
      "dhl"
      """
    Given I remember as "checkoutIdOne" following value:
      """
      "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I remember as "checkoutIdTwo" following value:
      """
      "184a8e77-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I use DB fixture "connection/third-party-auth-bus-message/third-party-auth-disabled/integration-of-shippings-installed"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "third-party.event.third-party.disconnected",
        "payload": {
          "business": {
            "id": "{{businessId}}"
          },
          "integration": {
            "name": "{{integrationName}}"
          },
          "connection": {
            "id": "{{connectionId}}",
            "name": "{{connectionName}}"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then print database connection url
    Then model "Connection" with id "{{connectionId}}" should not exist
    Then model "Checkout" with id "{{checkoutIdOne}}" should contain json:
      """
      {
        "_id": "{{checkoutIdOne}}",
        "connections": []
      }
      """
    Then model "Checkout" with id "{{checkoutIdTwo}}" should contain json:
      """
      {
        "_id": "{{checkoutIdTwo}}",
        "connections": []
      }
      """

  Scenario: Business Not Exists
    Given I use DB fixture "connection/third-party-auth-bus-message/third-party-auth-disabled/integration-of-payments-installed"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "third-party.event.third-party.disconnected",
        "payload": {
          "business": {
            "id": "not-existing-business"
          },
          "integration": {
            "name": "{{integrationName}}"
          },
          "connection": {
            "id": "{{connectionId}}",
            "name": "{{connectionName}}"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "Connection" with id "{{connectionId}}" should not exist

  Scenario: Integration Not Exists
    Given I use DB fixture "connection/third-party-auth-bus-message/third-party-auth-disabled/integration-of-payments-installed"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "third-party.event.third-party.disconnected",
        "payload": {
          "business": {
            "id": "{{businessId}}"
          },
          "integration": {
            "name": "not-existing-integration"
          },
          "connection": {
            "id": "{{connectionId}}",
            "name": "{{connectionName}}"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "Connection" with id "{{connectionId}}" should not exist

  Scenario: Business Subscription of Payment Integration Not Installed
    Given I use DB fixture "connection/third-party-auth-bus-message/third-party-auth-disabled/integration-not-installed"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "third-party.event.third-party.disconnected",
        "payload": {
          "business": {
            "id": "{{businessId}}"
          },
          "integration": {
            "name": "{{integrationName}}"
          },
          "connection": {
            "id": "{{connectionId}}",
            "name": "{{connectionName}}"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "Connection" with id "{{connectionId}}" should not exist

  Scenario: Connection of Payment Integration Installed
    Given I remember as "checkoutIdOne" following value:
      """
      "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I remember as "checkoutIdTwo" following value:
      """
      "184a8e77-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I use DB fixture "connection/third-party-auth-bus-message/third-party-auth-disabled/connection-installed"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "third-party.event.third-party.disconnected",
        "payload": {
          "business": {
            "id": "{{businessId}}"
          },
          "integration": {
            "name": "{{integrationName}}"
          },
          "connection": {
            "id": "{{connectionId}}",
            "name": "{{connectionName}}"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then print database connection url
    Then model "Connection" with id "{{connectionId}}" should not exist
    Then model "Checkout" with id "{{checkoutIdOne}}" should contain json:
      """
      {
        "_id": "{{checkoutIdOne}}",
        "connections": []
      }
      """
    Then model "Checkout" with id "{{checkoutIdTwo}}" should contain json:
      """
      {
        "_id": "{{checkoutIdTwo}}",
        "connections": []
      }
      """
