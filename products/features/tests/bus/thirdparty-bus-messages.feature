Feature: Third party bus message controller tests
  Background:
    Given I remember as "businessId" following value:
    """
      "bbbbbbbb-1111-2222-3333-bbbbbbbbbbbb"
    """
    Given I remember as "subscriptionId" following value:
    """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    """
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "{{businessId}}", "acls": []}]
      }]
    }
    """
  Scenario: Third party installed event
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
    """
    {
      "name": "connect.event.third-party.enabled",
      "payload": {
        "name": "some-third-party-installment",
        "category": "products",
        "businessId": "{{businessId}}"
      }
    }
    """
    Then I process messages from RabbitMQ "async_events_products_micro" channel
    And print RabbitMQ message list
    And model "Subsciption" found by following JSON should exist:
    """
    {
      "installed": true,
      "name": "some-third-party-installment"
    }
    """
  Scenario: Third party uninstalled event
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
    """
    {
      "name": "connect.event.third-party.disabled",
      "payload": {
        "name": "some-third-party-installment",
        "category": "products",
        "businessId": "{{businessId}}"
      }
    }
    """
    Then I process messages from RabbitMQ "async_events_products_micro" channel
    And print RabbitMQ message list
    And model "Subsciption" found by following JSON should exist:
    """
    {
      "installed": false,
      "name": "some-third-party-installment"
    }
    """
  Scenario: Third party connected event
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
    """
    {
      "name": "third-party.event.third-party.connected",
      "payload": {
        "business": {
          "id": "{{businessId}}"
        },
        "integration":{
          "name":"some-third-party-installment",
          "category": "products"
        }
      }
    }
    """
    Then I process messages from RabbitMQ "async_events_products_micro" channel
    And print RabbitMQ message list
    And model "Subsciption" found by following JSON should exist:
    """
    {
      "connected": true,
      "name": "some-third-party-installment"
    }
    """
  Scenario: Third party disconnected event
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
    """
    {
      "name": "third-party.event.third-party.disconnected",
      "payload": {
        "business": {
          "id": "{{businessId}}"
        },
        "integration":{
          "name":"some-third-party-installment",
          "category": "products"
        }
      }
    }
    """
    Then I process messages from RabbitMQ "async_events_products_micro" channel
    And print RabbitMQ message list
    And model "Subsciption" found by following JSON should exist:
    """
    {
      "connected": false,
      "name": "some-third-party-installment"
    }
    """
  Scenario: Third party exported event
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
    """
    {
      "name": "third-party.event.third-party.exported",
      "payload": {
        "businessId": "{{businessId}}",
        "name":"some-third-party-exported",
        "connected": true,
        "installed": true,
        "id":"{{subscriptionId}}"
      }
    }
    """
    Then I process messages from RabbitMQ "async_events_products_micro" channel
    And print RabbitMQ message list
    And model "Subsciption" found by following JSON should exist:
    """
    {
      "name":"some-third-party-exported"
    }
    """
  Scenario: Third party exported event
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
    """
    {
      "name": "connect.event.third-party.exported",
      "payload": {
        "businessId": "{{businessId}}",
        "name":"some-third-party-exported-2",
        "connected": true,
        "installed": true,
        "id":"{{subscriptionId}}"
      }
    }
    """
    Then I process messages from RabbitMQ "async_events_products_micro" channel
    And print RabbitMQ message list
    And model "Subsciption" found by following JSON should exist:
    """
    {
      "name":"some-third-party-exported-2"
    }
    """