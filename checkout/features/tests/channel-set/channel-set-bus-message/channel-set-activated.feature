Feature: Channel set API

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "channelSetIdPosOne" following value:
      """
      "a888336c-fe1f-439c-b13c-f351db6bbc2e"
      """
    Given I remember as "channelSetIdPosTwo" following value:
      """
      "c42f5758-cd13-4c2f-b1a4-05fc73c5a39a"
      """
    Given I remember as "channelSetIdPosThree" following value:
      """
      "c7c2af97-8ebd-4593-9c38-35577f5e0a14"
      """
    Given I remember as "channelSetIdLinkOne" following value:
      """
      "c42f5758-cd13-4c2f-b1a4-05fc73c5a39a"
      """
    Given I remember as "channelSetIdFinExpOne" following value:
      """
      "cc1ea7d2-ea03-44f5-b54f-2adedd0879e0"
      """
    Given I remember as "channelSetIdShopOne" following value:
      """
      "b185a2c1-4fcc-4c63-aa7b-6b7adb560aa9"
      """
    Given I remember as "channelSetIdShopTwo" following value:
      """
      "73572bad-3a35-4e1d-b1c9-d5a115146443"
      """
    Given I remember as "channelSetIdShopThree" following value:
      """
      "9e2aefb3-e849-4430-a962-79d0f7e00e96"
      """

  Scenario: Activate first already activated POS among three others POS
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.activated/existing-channel-sets-pos-one-is-active"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.activated",
        "payload": {
          "id": "{{channelSetIdPosOne}}",
          "business": {
            "id": "{{businessId}}"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetIdPosOne}}" should contain json:
      """
      {
        "_id": "{{channelSetIdPosOne}}",
        "active": true
      }
      """
    Then model "ChannelSet" with id "{{channelSetIdPosTwo}}" should contain json:
      """
      {
        "_id": "{{channelSetIdPosTwo}}",
        "active": false
      }
      """
    Then model "ChannelSet" with id "{{channelSetIdPosThree}}" should contain json:
      """
      {
        "_id": "{{channelSetIdPosThree}}",
        "active": false
      }
      """

  Scenario: Activate second POS among three others POS
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.activated/existing-channel-sets-pos-one-is-active"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.activated",
        "payload": {
          "id": "{{channelSetIdPosTwo}}",
          "business": {
            "id": "{{businessId}}"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetIdPosOne}}" should contain json:
      """
      {
        "_id": "{{channelSetIdPosOne}}",
        "active": false
      }
      """
    Then model "ChannelSet" with id "{{channelSetIdPosTwo}}" should contain json:
      """
      {
        "_id": "{{channelSetIdPosTwo}}",
        "active": true
      }
      """
    Then model "ChannelSet" with id "{{channelSetIdPosThree}}" should contain json:
      """
      {
        "_id": "{{channelSetIdPosThree}}",
        "active": false
      }
      """

  Scenario: Activate last POS among three others POS
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.activated/existing-channel-sets-pos-one-is-active"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.activated",
        "payload": {
          "id": "{{channelSetIdPosThree}}",
          "business": {
            "id": "{{businessId}}"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetIdPosOne}}" should contain json:
      """
      {
        "_id": "{{channelSetIdPosOne}}",
        "active": false
      }
      """
    Then model "ChannelSet" with id "{{channelSetIdPosTwo}}" should contain json:
      """
      {
        "_id": "{{channelSetIdPosTwo}}",
        "active": false
      }
      """
    Then model "ChannelSet" with id "{{channelSetIdPosThree}}" should contain json:
      """
      {
        "_id": "{{channelSetIdPosThree}}",
        "active": true
      }
      """

  Scenario: Activate POS among others types
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.activated/existing-channel-sets-three-different-types"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.activated",
        "payload": {
          "id": "{{channelSetIdPosOne}}",
          "business": {
            "id": "{{businessId}}"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetIdPosOne}}" should contain json:
      """
      {
        "_id": "{{channelSetIdPosOne}}",
        "active": true
      }
      """
    Then model "ChannelSet" with id "{{channelSetIdLinkOne}}" should contain json:
      """
      {
        "_id": "{{channelSetIdLinkOne}}",
        "active": false
      }
      """
    Then model "ChannelSet" with id "{{channelSetIdFinExpOne}}" should contain json:
      """
      {
        "_id": "{{channelSetIdFinExpOne}}",
        "active": false
      }
      """

  Scenario: Activate Link among others types
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.activated/existing-channel-sets-three-different-types"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.activated",
        "payload": {
          "id": "{{channelSetIdLinkOne}}",
          "business": {
            "id": "{{businessId}}"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetIdPosOne}}" should contain json:
      """
      {
        "_id": "{{channelSetIdPosOne}}",
        "active": false
      }
      """
    Then model "ChannelSet" with id "{{channelSetIdLinkOne}}" should contain json:
      """
      {
        "_id": "{{channelSetIdLinkOne}}",
        "active": true
      }
      """
    Then model "ChannelSet" with id "{{channelSetIdFinExpOne}}" should contain json:
      """
      {
        "_id": "{{channelSetIdFinExpOne}}",
        "active": false
      }
      """

  Scenario: Activate Shop among Shop and POS types
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.activated/existing-channel-sets-shop-one-is-active-and-pos"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.activated",
        "payload": {
          "id": "{{channelSetIdShopOne}}",
          "business": {
            "id": "{{businessId}}"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetIdPosOne}}" should contain json:
      """
      {
        "_id": "{{channelSetIdPosOne}}",
        "active": true
      }
      """
    Then model "ChannelSet" with id "{{channelSetIdPosTwo}}" should contain json:
      """
      {
        "_id": "{{channelSetIdPosTwo}}",
        "active": false
      }
      """
    Then model "ChannelSet" with id "{{channelSetIdShopOne}}" should contain json:
      """
      {
        "_id": "{{channelSetIdShopOne}}",
        "active": true
      }
      """
    Then model "ChannelSet" with id "{{channelSetIdShopTwo}}" should contain json:
      """
      {
        "_id": "{{channelSetIdShopTwo}}",
        "active": false
      }
      """
    Then model "ChannelSet" with id "{{channelSetIdShopThree}}" should contain json:
      """
      {
        "_id": "{{channelSetIdShopThree}}",
        "active": false
      }
      """

  Scenario: No business
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.activated/no-business"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.activated",
        "payload": {
          "id": "{{channelSetIdShopOne}}",
          "business": {
            "id": "{{businessId}}"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel

  Scenario: No channel set
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.activated/no-channel-set"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.activated",
        "payload": {
          "id": "{{channelSetIdPosOne}}",
          "business": {
            "id": "{{businessId}}"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel

