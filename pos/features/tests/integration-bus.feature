@integration-bus
Feature: Integration bus
  Background:
    Given I remember as "businessId" following value:
      """
      "dac8cff5-dfc5-4461-b0e3-b25839527304"
      """
    Given I remember as "terminalId1" following value:
      """
      "dac8cff5-dfc5-4461-b0e3-b25839527305"
      """
    Given I remember as "terminalId2" following value:
      """
      "dac8cff5-dfc5-4461-b0e3-b25839527315"
      """
    Given I remember as "channelSetId" following value:
      """
      "ddac8cff5-dfc5-4461-b0e3-b25839527207"
      """
  Scenario: On integration enabled
    Given I use DB fixture "businesses"
    Given I use DB fixture "integrations"
    Given I use DB fixture "terminal"
    And I publish in RabbitMQ channel "async_events_pos_micro" message with json:
      """
      {
        "name": "connect.event.third-party.enabled",
        "payload": {
          "businessId": "{{businessId}}",
          "name": "qr",
          "category": "communications"
        }
      }
      """
    When I process messages from RabbitMQ "async_events_pos_micro" channel
    And print RabbitMQ message list
    And look for model "Business" with id "{{businessId}}" and remember as "business"
    And print storage key "business"
    And stored value "business" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "defaultLanguage": "en",
        "terminals": [
          "{{terminalId1}}",
          "{{terminalId2}}"
        ],
        "__v": 1,
        "channelSets": []
      }
      """
    And look for model "Terminal" with id "{{terminalId1}}" and remember as "terminal1"
    And print storage key "terminal1"
    And stored value "terminal1" should contain json:
      """
      {
        "_id": "{{terminalId1}}",
        "channelSets": [
          "dac8cff5-dfc5-4461-b0e3-b25839527307",
          "*"
        ]
      }
      """
    And look for model "Terminal" with id "{{terminalId2}}" and remember as "terminal2"
    And print storage key "terminal2"
    And stored value "terminal2" should contain json:
      """
      {
        "_id": "{{terminalId2}}",
        "channelSets": [
          "dac8cff5-dfc5-4461-b0e3-b25839527307",
          "*"
        ]
      }
      """

  Scenario: On onboarding setup terminal integrations
    Given I use DB fixture "businesses"
    Given I use DB fixture "integrations"
    Given I use DB fixture "terminal"
    And I publish in RabbitMQ channel "async_events_pos_micro" message with json:
      """
      {
        "name": "onboarding.event.setup.terminal",
        "payload": {
          "businessId": "{{businessId}}",
          "integrationsToInstall": ["qr"]
        }
      }
      """
    When I process messages from RabbitMQ "async_events_pos_micro" channel
    And print RabbitMQ message list
    And look for model "Business" with id "{{businessId}}" and remember as "business"
    And print storage key "business"
    And stored value "business" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "defaultLanguage": "en",
        "terminals": [
          "{{terminalId1}}",
          "{{terminalId2}}"
        ]
      }
      """
    And look for model "Terminal" with id "{{terminalId1}}" and remember as "terminal1"
    And print storage key "terminal1"
    And stored value "terminal1" should contain json:
      """
      {
        "_id": "{{terminalId1}}",
        "channelSets": [
          "dac8cff5-dfc5-4461-b0e3-b25839527307",
          "*"
        ]
      }
      """
    And look for model "Terminal" with id "{{terminalId2}}" and remember as "terminal2"
    And print storage key "terminal2"
    And stored value "terminal2" should contain json:
      """
      {
        "_id": "{{terminalId2}}",
        "channelSets": [
          "dac8cff5-dfc5-4461-b0e3-b25839527307",
          "*"
        ]
      }
      """
  Scenario: On onboarding setup terminal integrations
    And I publish in RabbitMQ channel "async_events_pos_micro" message with json:
      """
      {
        "name": "onboarding.event.setup.terminal",
        "payload": {
          "businessId": "{{businessId}}",
          "integrationsToInstall": ["qr"]
        }
      }
      """
    When I process messages from RabbitMQ "async_events_pos_micro" channel
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
          "integrationsToInstall": ["qr"]
        }
      }
      """

  Scenario: On integration disabled, remove optional channel set
    Given I use DB fixture "optional-channel-type"
    Given I use DB fixture "integrations"
    And look for model "Business" with id "{{businessId}}" and remember as "businessCreated"
    And print storage key "businessCreated"
    And stored value "businessCreated" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "defaultLanguage": "en",
        "terminals": [
          "{{terminalId1}}",
          "{{terminalId2}}"
        ],
        "channelSets": [
          "dac8cff5-dfc5-4461-b0e3-b25839527307",
          "dac8cff5-dfc5-4461-b0e3-b25839527207"
        ]
      }
      """
    And look for model "Terminal" with id "{{terminalId1}}" and remember as "terminal1"
    And print storage key "terminal1"
    And stored value "terminal1" should contain json:
      """
      {
        "_id": "{{terminalId1}}",
        "channelSets": [
          "dac8cff5-dfc5-4461-b0e3-b25839527307",
          "dac8cff5-dfc5-4461-b0e3-b25839527207"
        ]
      }
      """
    And look for model "Terminal" with id "{{terminalId2}}" and remember as "terminal2"
    And print storage key "terminal2"
    And stored value "terminal2" should contain json:
      """
      {
        "_id": "{{terminalId2}}",
        "channelSets": [
          "dac8cff5-dfc5-4461-b0e3-b25839527307",
          "dac8cff5-dfc5-4461-b0e3-b25839527207"
        ]
      }
      """
    And I publish in RabbitMQ channel "async_events_pos_micro" message with json:
      """
      {
        "name": "connect.event.third-party.disabled",
        "payload": {
          "businessId": "{{businessId}}",
          "name": "email",
          "category": "communications"
        }
      }
      """
    When I process messages from RabbitMQ "async_events_pos_micro" channel
    And print RabbitMQ message list
    And look for model "Business" with id "{{businessId}}" and remember as "business"
    And print storage key "business"
    And stored value "business" should not contain json:
      """
      {
        "channelSets": [
          "dac8cff5-dfc5-4461-b0e3-b25839527207"
        ]
      }
      """
    And stored value "business" should contain json:
      """
      {
        "_id": "{{businessId}}",
        "defaultLanguage": "en",
        "terminals": [
          "{{terminalId1}}",
          "{{terminalId2}}"
        ],
        "channelSets": [
          "dac8cff5-dfc5-4461-b0e3-b25839527307"
        ]
      }
      """
    And look for model "Terminal" with id "{{terminalId1}}" and remember as "terminal1"
    And print storage key "terminal1"
    And stored value "terminal1" should not contain json:
      """
      {
        "channelSets": [
          "dac8cff5-dfc5-4461-b0e3-b25839527207"
        ]
      }
      """
    And look for model "Terminal" with id "{{terminalId2}}" and remember as "terminal2"
    And print storage key "terminal2"
    And stored value "terminal2" should not contain json:
      """
      {
        "channelSets": [
          "dac8cff5-dfc5-4461-b0e3-b25839527207"
        ]
      }
      """
    And model "ChannelSet" with id "{{channelSetId}}" should not exist