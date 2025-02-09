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
    Given I remember as "channelSetIdLink" following value:
      """
      "a888336c-fe1f-439c-b13c-f351db6bbc2e"
      """
    Given I remember as "channelSetIdShop" following value:
      """
      "f351db6b-439c-b13c-fe1f-a888336cbc2e"
      """
    Given I remember as "channelSetIdPos" following value:
      """
      "8d49b19f-4aab-a8c7-c447-a803d4c3bc2e"
      """

  Scenario: Remove one existing channel-set
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.deleted/existing-channel-set-one"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.deleted",
        "payload": {
          "_id": "{{channelSetIdLink}}",
          "id": "{{channelSetIdLink}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetIdLink}}" should not exist
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "channelSets": []
      }
      """
    And model "Business" with id "{{businessId}}" should not contain json:
      """
      {
        "channelSets": [
          "{{channelSetIdLink}}"
        ]
      }
      """

  Scenario: Remove first from many existing channel-sets
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.deleted/existing-channel-set-many"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.deleted",
        "payload": {
          "_id": "{{channelSetIdLink}}",
          "id": "{{channelSetIdLink}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetIdLink}}" should not exist
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "channelSets": [
          "{{channelSetIdShop}}",
          "{{channelSetIdPos}}"
        ]
      }
      """
    And model "Business" with id "{{businessId}}" should not contain json:
      """
      {
        "channelSets": [
          "{{channelSetIdLink}}"
        ]
      }
      """

  Scenario: Remove middle from many existing channel-sets
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.deleted/existing-channel-set-many"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.deleted",
        "payload": {
          "_id": "{{channelSetIdShop}}",
          "id": "{{channelSetIdShop}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetIdShop}}" should not exist
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "channelSets": [
          "{{channelSetIdLink}}",
          "{{channelSetIdPos}}"
        ]
      }
      """
    And model "Business" with id "{{businessId}}" should not contain json:
      """
      {
        "channelSets": [
          "{{channelSetIdShop}}"
        ]
      }
      """

  Scenario: Remove last from many existing channel-sets
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.deleted/existing-channel-set-many"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.deleted",
        "payload": {
          "_id": "{{channelSetIdPos}}",
          "id": "{{channelSetIdPos}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetIdPos}}" should not exist
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "channelSets": [
          "{{channelSetIdLink}}",
          "{{channelSetIdShop}}"
        ]
      }
      """
    And model "Business" with id "{{businessId}}" should not contain json:
      """
      {
        "channelSets": [
          "{{channelSetIdPos}}"
        ]
      }
      """
