Feature: Plugin commands

  Background:
    Given I authenticate as a user with the following data:
      """
      {
        "id": "08a3fac8-43ef-4998-99aa-cabc97a39261",
        "email": "email@email.com",
        "roles": [
          {
            "name": "admin",
            "permissions": []
          }
        ]
      }
      """
    Given I remember as "businessId" following value:
      """
      "dac8cff5-dfc5-4461-b0e3-b25839527304"
      """
    Given I remember as "channelType" following value:
      """
      "magento"
      """

  Scenario: add Api Key
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"
    And I send a POST request to "/api/business/dac8cff5-dfc5-4461-b0e3-b25839527304/shopsystem/type/{{channelType}}/api-key" with json:
      """
      {
        "id": "dac8cff5-dfc5-4461-b0e3-b25839527305"
      }
      """
    And print last response
    Then the response status code should be 200
    Then model "ShopSystem" with id "dac8cff5-dfc5-4461-b0e3-b25839527304" should not contain json:
      """
      {
        "_id": "dac8cff5-dfc5-4461-b0e3-b25839527304",
        "apiKeys": [
          {
            "_id": "dac8cff5-dfc5-4461-b0e3-b25839527304"
          },
          {
            "_id": "dac8cff5-dfc5-4461-b0e3-b25839527305"
          }
        ]
      }
      """

  Scenario: get Api Key
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"
    And I send a GET request to "/api/business/dac8cff5-dfc5-4461-b0e3-b25839527304/shopsystem/type/{{channelType}}/api-key"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        "dac8cff5-dfc5-4461-b0e3-b25839527304"
      ]
      """

  Scenario: add Api Key via RPC
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"
    When I publish in RabbitMQ channel "async_events_plugins_micro" message with json:
      """
      {
        "name": "plugins.rpc.shopsystem.create-api-key",
        "payload": {
          "businessId": "{{business}}",
          "channelType": "{{channelType}}",
          "id": "dac8cff5-dfc5-4461-b0e3-b25839527305"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_plugins_micro" channel
    Then model "ShopSystem" with id "{{business}}" should not contain json:
      """
      {
        "_id": "dac8cff5-dfc5-4461-b0e3-b25839527304",
        "apiKeys": [
          {
            "_id": "dac8cff5-dfc5-4461-b0e3-b25839527304"
          },
          {
            "_id": "dac8cff5-dfc5-4461-b0e3-b25839527305"
          }
        ]
      }
      """

  Scenario: get Api Key via RPC
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"
    When I publish in RabbitMQ channel "async_events_plugins_micro" message with json:
      """
      {
        "name": "plugins.rpc.shopsystem.api-keys",
        "payload": {
          "businessId": "{{business}}",
          "channelType": "{{channelType}}"
        }
      }
      """
    And I process messages from RabbitMQ "async_events_plugins_micro" channel
