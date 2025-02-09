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
    Given I remember as "channelType" following value:
      """
      "magento"
      """

  Scenario: Create plugin command with admin access
    Given I get file "features/fixtures/json/plugin-basic-command.payload.json" content and remember as "commandPayload"
    And I send a POST request to "/api/plugin/command" with json:
      """
      {{commandPayload}}
      """
    And print last response
    Then the response status code should be 201
    And I send a GET request to "/api/plugin/command/list"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {{commandPayload}}
      ]
      """

  Scenario: delete plugin command with admin access
    Given I use DB fixture "plugin-commands"
    Given I get file "features/fixtures/json/plugin-basic-command.payload.json" content and remember as "commandPayload"
    And I send a DELETE request to "/api/plugin/command/d73635ff-51da-41ca-bfab-f08052de6163"
    And print last response
    Then the response status code should be 200

  Scenario: List plugin commands
    Given I use DB fixture "plugin-commands"
    Then I send a GET request to "/api/plugin/command/list?channelType={{channelType}}"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "name": "set-live-host"
        },
        {
          "name": "notify-new-plugin-version"
        },
        {
          "name": "notify-new-plugin-version"
        },
        {
          "name": "notify-new-plugin-version"
        },
        {
          "name": "notify-new-plugin-version"
        }
      ]
      """
    Then I send a GET request to "/api/plugin/command/list?channelType={{channelType}}&cmsVersion=2.1.0"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "name": "set-live-host",
          "value": "https://stub-live.host"
        },
        {
          "channelType": "{{channelType}}",
          "maxCmsVersion": "2.3.0",
          "metadata": {
            "filename": "https://payeverproduction.blob.core.windows.net/payever-magento2-payments-1.6.0.zip"
          },
          "minCmsVersion": "2.1.0",
          "name": "notify-new-plugin-version",
          "value": "1.6.0"
        }
      ]
      """
    And the response should not contain json:
      """
      [
        {
          "channelType" : "shopware"
        }
      ]
      """
    Then I send a GET request to "/api/plugin/command/list?channelType={{channelType}}&cmsVersion=3.1.0"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "name": "set-live-host",
          "value": "https://stub-live.host"
        }
      ]
      """
    And the response should not contain json:
      """
      [
        {
          "name": "notify-new-plugin-version"
        }
      ]
      """

  Scenario: List plugin commands from specific timestamp
    Given I use DB fixture "plugin-commands"
    And I send a GET request to "/api/plugin/command/list?from=1565341784"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "name": "set-live-host"
        }
      ]
      """
    Then I send a GET request to "/api/plugin/command/list?from=1565341794"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      []
      """