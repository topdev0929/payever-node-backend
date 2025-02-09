Feature: Channel set API

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "channelSetId" following value:
      """
      "a888336c-fe1f-439c-b13c-f351db6bbc2e"
      """

  Scenario: Consume channel named then consumer channel created
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
      """
        {
          "name": "channels.event.channel-set.named",
          "payload": {
            "id": "{{channelSetId}}",
            "name": "test business 2-eln9"
          }
        }
      """
    And process messages from RabbitMQ "async_events_products_micro" channel
    Then model "ChannelSet" found by following JSON should exist:
      """
      {
        "_id": "{{channelSetId}}",
        "name": "test business 2-eln9",
        "policyEnabled": true
      }
      """
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created",
        "payload": {
          "business": {
            "id": "{{businessId}}"
          },
          "channel": {
            "customPolicy": false,
            "enabledByDefault": false,
            "type": "shop"
          },
          "id": "{{channelSetId}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_products_micro" channel
    Then model "ChannelSet" found by following JSON should exist:
      """
      {
        "_id": "{{channelSetId}}",
        "customPolicy": false,
        "enabledByDefault": false,
        "policyEnabled": true,
        "type": "shop",
        "businessId": "{{businessId}}"
      }
      """

  Scenario: Create new channel set
    Given I use DB fixture "channel-set/channel-set-bus-message/no-channel-set"
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created",
        "payload": {
          "id": "{{channelSetId}}",
          "business": {
            "id": "{{businessId}}"
          },
          "channel": {
            "customPolicy": false,
            "enabledByDefault": false,
            "type":"shop"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_products_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "businessId": "{{businessId}}",
        "type": "shop"
      }
      """

  Scenario: Update existing channel set
    Given I use DB fixture "channel-set/channel-set-bus-message/existing-channel-set-one"
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created",
        "payload": {
          "id": "{{channelSetId}}",
          "business": {
            "id": "{{businessId}}"
          },
          "channel": {
            "type":"link"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_products_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "businessId": "{{businessId}}",
        "type": "link"
      }
      """

  Scenario: Create new channel set with customPolicy flag
    Given I use DB fixture "channel-set/channel-set-bus-message/no-channel-set"
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
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
    And process messages from RabbitMQ "async_events_products_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "businessId": "{{businessId}}",
        "customPolicy": true,
        "policyEnabled": true,
        "type": "shop"
      }
      """
