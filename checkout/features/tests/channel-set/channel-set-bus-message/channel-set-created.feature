Feature: Channel set API
  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "checkoutId" following value:
      """
      "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I remember as "channelSetId" following value:
      """
      "a888336c-fe1f-439c-b13c-f351db6bbc2e"
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "checkouts",
          {}
        ],
        "result": {}
      }
      """

  Scenario: Create new, shop type (not creating by default channel type) no any checkout
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created/no-channel-sets-no-any-checkout"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created",
        "payload": {
          "id": "{{channelSetId}}",
          "business": {
            "id": "{{businessId}}"
          },
          "channel": {
            "type":"shop"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "type": "shop"
      }
      """
    And model "ChannelSet" with id "{{channelSetId}}" should not contain json:
      """
      {
        "checkout": "{{checkoutId}}"
      }
      """
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "channelSets": [
          "{{channelSetId}}"
        ]
      }
      """
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
          "name":"checkout.event.checkout.channel-set-linked",
          "payload":{
            "channelSetId":"{{channelSetId}}",
            "checkoutId":"{{checkoutId}}"
          }
        }
      ]
      """

  Scenario: Create new, shop type (not creating by default channel type) existing non-default checkout
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created/no-channel-sets-non-default-checkout"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created",
        "payload": {
          "id": "{{channelSetId}}",
          "business": {
            "id": "{{businessId}}"
          },
          "channel": {
            "type":"shop"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "type": "shop"
      }
      """
    And model "ChannelSet" with id "{{channelSetId}}" should not contain json:
      """
      {
        "checkout": "{{checkoutId}}"
      }
      """
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "channelSets": [
          "{{channelSetId}}"
        ]
      }
      """
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
          "name":"checkout.event.checkout.channel-set-linked",
          "payload":{
            "channelSetId":"{{channelSetId}}",
            "checkoutId":"{{checkoutId}}"
          }
        }
      ]
      """

  Scenario: Create new, shop type (not creating by default channel type) existing default checkout
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created/no-channel-sets-default-checkout"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created",
        "payload": {
          "id": "{{channelSetId}}",
          "business": {
            "id": "{{businessId}}"
          },
          "channel": {
            "type":"shop"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "type": "shop"
      }
      """
    And model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "checkout": "{{checkoutId}}"
      }
      """
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "channelSets": [
          "{{channelSetId}}"
        ]
      }
      """
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name":"checkout.event.checkout.channel-set-linked",
          "payload":{
            "channelSetId":"{{channelSetId}}",
            "checkoutId":"{{checkoutId}}"
          }
        }
      ]
      """

  Scenario: Update existing, shop type (not creating by default channel type)
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created/existing-channel-set-shop"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created",
        "payload": {
          "id": "{{channelSetId}}",
          "business": {
            "id": "{{businessId}}"
          },
          "channel": {
            "type":"shop"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "checkout": "{{checkoutId}}",
        "type": "shop"
      }
      """
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "channelSets": [
          "{{channelSetId}}"
        ]
      }
      """
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name":"checkout.event.checkout.channel-set-linked",
          "payload":{
            "channelSetId":"{{channelSetId}}",
            "checkoutId":"{{checkoutId}}"
          }
        }
      ]
      """

  Scenario: Update existing, shop type (not creating by default channel type) without default checkout
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created/existing-channel-set-shop-no-default-checkout"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created",
        "payload": {
          "id": "{{channelSetId}}",
          "business": {
            "id": "{{businessId}}"
          },
          "channel": {
            "type":"shop"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "type": "shop"
      }
      """
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "channelSets": [
          "{{channelSetId}}"
        ]
      }
      """
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
          "name":"checkout.event.checkout.channel-set-linked",
          "payload":{
            "channelSetId":"{{channelSetId}}",
            "checkoutId":"{{checkoutId}}"
          }
        }
      ]
      """

  Scenario: Update existing, shop type (not creating by default channel type) not pushed to business
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created/existing-channel-set-shop-not-pushed-to-business"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created",
        "payload": {
          "id": "{{channelSetId}}",
          "business": {
            "id": "{{businessId}}"
          },
          "channel": {
            "type":"shop"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "checkout": "{{checkoutId}}",
        "type": "shop"
      }
      """
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "channelSets": [
          "{{channelSetId}}"
        ]
      }
      """
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name":"checkout.event.checkout.channel-set-linked",
          "payload":{
            "channelSetId":"{{channelSetId}}",
            "checkoutId":"{{checkoutId}}"
          }
        }
      ]
      """

  Scenario: Create new, shop type with customPolicy flag
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created/no-channel-sets-no-any-checkout"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created",
        "payload": {
          "id": "{{channelSetId}}",
          "business": {
            "id": "{{businessId}}"
          },
          "channel": {
            "customPolicy": true,
            "type":"shop"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "customPolicy": true,
        "policyEnabled": true,
        "type": "shop"
      }
      """
    And model "ChannelSet" with id "{{channelSetId}}" should not contain json:
      """
      {
        "checkout": "{{checkoutId}}"
      }
      """
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "channelSets": [
          "{{channelSetId}}"
        ]
      }
      """

  Scenario: Create new, link type (creating by default channel type) no any checkout
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created/no-channel-sets-no-any-checkout"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created",
        "payload": {
          "id": "{{channelSetId}}",
          "business": {
            "id": "{{businessId}}"
          },
          "channel": {
            "enabledByDefault": true,
            "type":"link"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then print RabbitMQ message list
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "enabledByDefault": true,
        "type": "link"
      }
      """
    And model "ChannelSet" with id "{{channelSetId}}" should not contain json:
      """
      {
        "checkout": "{{checkoutId}}"
      }
      """
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "channelSets": [
          "{{channelSetId}}"
        ]
      }
      """
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
          "name":"checkout.event.checkout.channel-set-linked",
          "payload":{
            "channelSetId":"{{channelSetId}}",
            "checkoutId":"{{checkoutId}}"
          }
        }
      ]
      """

  Scenario: Create new, link type (creating by default channel type) existing non-default checkout
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created/no-channel-sets-non-default-checkout"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created",
        "payload": {
          "id": "{{channelSetId}}",
          "business": {
            "id": "{{businessId}}"
          },
          "channel": {
            "enabledByDefault": true,
            "type":"link"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then print RabbitMQ message list
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "type": "link",
        "enabledByDefault": true
      }
      """
    And model "ChannelSet" with id "{{channelSetId}}" should not contain json:
      """
      {
        "checkout": "{{checkoutId}}"
      }
      """
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "channelSets": [
          "{{channelSetId}}"
        ]
      }
      """
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
          "name":"checkout.event.checkout.channel-set-linked",
          "payload":{
            "channelSetId":"{{channelSetId}}",
            "checkoutId":"{{checkoutId}}"
          }
        }
      ]
      """

  Scenario: Create new, link type (creating by default channel type) existing default checkout
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created/no-channel-sets-default-checkout"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created",
        "payload": {
          "id": "{{channelSetId}}",
          "business": {
            "id": "{{businessId}}"
          },
          "channel": {
            "type":"link",
            "enabledByDefault": true
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then print RabbitMQ message list
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "type": "link",
        "enabledByDefault": true
      }
      """
    And model "ChannelSet" with id "{{channelSetId}}" should not contain json:
      """
      {
        "checkout": "{{checkoutId}}"
      }
      """
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "channelSets": [
          "{{channelSetId}}"
        ]
      }
      """
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
          "name":"checkout.event.checkout.channel-set-linked",
          "payload":{
            "channelSetId":"{{channelSetId}}",
            "checkoutId":"{{checkoutId}}"
          }
        }
      ]
      """

  Scenario: Update existing, link type (creating by default channel type)
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created/existing-channel-set-link"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created",
        "payload": {
          "id": "{{channelSetId}}",
          "business": {
            "id": "{{businessId}}"
          },
          "channel": {
            "type":"link",
            "enabledByDefault": true
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "type": "link",
        "enabledByDefault": true
      }
      """
    And model "ChannelSet" with id "{{channelSetId}}" should not contain json:
      """
      {
        "checkout": "{{checkoutId}}"
      }
      """
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "channelSets": [
          "{{channelSetId}}"
        ]
      }
      """
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
          "name":"checkout.event.checkout.channel-set-linked",
          "payload":{
            "channelSetId":"{{channelSetId}}",
            "checkoutId":"{{checkoutId}}"
          }
        }
      ]
      """

  Scenario: Update existing, link type (creating by default channel type) without default checkout
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created/existing-channel-set-link-no-default-checkout"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created",
        "payload": {
          "id": "{{channelSetId}}",
          "business": {
            "id": "{{businessId}}"
          },
          "channel": {
            "type":"link",
            "enabledByDefault": true
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "type": "link",
        "enabledByDefault": true
      }
      """
    And model "ChannelSet" with id "{{channelSetId}}" should not contain json:
      """
      {
        "checkout": "{{checkoutId}}"
      }
      """
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "channelSets": [
          "{{channelSetId}}"
        ]
      }
      """
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
          "name":"checkout.event.checkout.channel-set-linked",
          "payload":{
            "channelSetId":"{{channelSetId}}",
            "checkoutId":"{{checkoutId}}"
          }
        }
      ]
      """

  Scenario: Update existing, link type (creating by default channel type) not pushed to business
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created/existing-channel-set-link-not-pushed-to-business"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created",
        "payload": {
          "id": "{{channelSetId}}",
          "business": {
            "id": "{{businessId}}"
          },
          "channel": {
            "type":"link",
            "enabledByDefault": true
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "type": "link",
        "enabledByDefault": true
      }
      """
    And model "ChannelSet" with id "{{channelSetId}}" should not contain json:
      """
      {
        "checkout": "{{checkoutId}}"
      }
      """
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "channelSets": [
          "{{channelSetId}}"
        ]
      }
      """
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
          "name":"checkout.event.checkout.channel-set-linked",
          "payload":{
            "channelSetId":"{{channelSetId}}",
            "checkoutId":"{{checkoutId}}"
          }
        }
      ]
      """

  Scenario: Create new, link type without customPolicy flag
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created/no-channel-sets-default-checkout"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created",
        "payload": {
          "id": "{{channelSetId}}",
          "business": {
            "id": "{{businessId}}"
          },
          "channel": {
            "enabledByDefault": true,
            "type":"link"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then print RabbitMQ message list
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "enabledByDefault": true,
        "customPolicy": false,
        "policyEnabled": true,
        "type": "link"
      }
      """
    And model "ChannelSet" with id "{{channelSetId}}" should not contain json:
      """
      {
        "checkout": "{{checkoutId}}"
      }
      """
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "channelSets": [
          "{{channelSetId}}"
        ]
      }
      """
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
          "name":"checkout.event.checkout.channel-set-linked",
          "payload":{
            "channelSetId":"{{channelSetId}}",
            "checkoutId":"{{checkoutId}}"
          }
        }
      ]
      """
