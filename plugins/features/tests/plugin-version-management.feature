Feature: Plugin version management
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
    Given I remember as "pluginsCiAuthUser" following value:
      """
      "plugins_ci"
      """
    Given I remember as "pluginsCiAuthPassword" following value:
      """
      "UAyDaB5USZjz3RrSX"
      """

  Scenario: Get latest plugin version
    Given I use DB fixture "common-channel"
    And I use DB fixture "common-plugin"
    When I send a GET request to "/api/plugin/channel/{{channelType}}/latest"
    And print last response
    Then the response status code should be 404
    And the response should contain json:
      """
      {
        "message": "Seems like we have no plugin version with given parameters."
      }
      """
    Then I use DB fixture "plugin-version"
    When I send a GET request to "/api/plugin/channel/{{channelType}}/latest?cmsVersion=2.1.0"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "filename": "*",
        "version": "2.13.3",
        "maxCmsVersion" : "2.3.0",
        "minCmsVersion" : "2.0.0"
      }
      """
    When I send a GET request to "/api/plugin/channel/{{channelType}}/latest?cmsVersion=1.8.0"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "filename": "*",
        "maxCmsVersion": "1.9.99",
        "minCmsVersion": "1.7.0",
        "version": "2.2.0"
      }
      """
    When I send a GET request to "/api/plugin/channel/{{channelType}}/latest?cmsVersion=9999999-dev"
    And print last response
    Then the response status code should be 400
    And the response should match to "/Invalid argument not valid semver/"

  Scenario: Push new plugin version
    Given I use DB fixture "common-channel"
    And I use DB fixture "common-plugin"
    And I get file "features/fixtures/json/plugin-new-version.payload.json" content and remember as "newPluginVersion"
    Given set Authorization header to "{{pluginsCiAuthUser}}", "{{pluginsCiAuthPassword}}"
    When I send a POST request to "/api/plugin/publish/{{channelType}}" with json:
      """
      {{newPluginVersion}}
      """
    Then the response status code should be 201
    And I send a GET request to "/api/plugin/channel/{{channelType}}/latest"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{newPluginVersion}}
      """
    Then I send a GET request to "/api/plugin/command/list?channelType={{channelType}}"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "channelType": "{{channelType}}",
          "name": "notify-new-plugin-version",
          "metadata": {
            "filename": "https://payeverproduction.blob.core.windows.net/magento2-payments-3.0.0.zip"
          },
          "value": "3.0.0",
          "minCmsVersion": "2.1.0",
          "maxCmsVersion": "2.4.0"
        }
      ]
      """
