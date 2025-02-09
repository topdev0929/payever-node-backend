Feature: Plugin http

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

  Scenario: get plugin by id
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"
    And I use DB fixture "common-plugin"
    And I use DB fixture "plugin-commands"
    And I send a GET request to "/api/plugin/7d6f6431-a7b1-40ab-b0b7-15aede2a2653"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
           "_id": "7d6f6431-a7b1-40ab-b0b7-15aede2a2653",
           "channel": "67d580f7-ebf5-40e4-9367-63b8b0e0ae26",
           "description": "description 1",
           "documentation": "https://getpayever.com/shopsystem/magento/",
           "marketplace": "https://marketplace.magento.com/payever-magento2-payments.html",
           "pluginFiles": []
         }
      """

  Scenario: get plugin by channel
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"
    And I use DB fixture "common-plugin"
    And I use DB fixture "plugin-commands"
    And I send a GET request to "/api/plugin/channel/{{channelType}}"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
           "_id": "*",
           "channel": "67d580f7-ebf5-40e4-9367-63b8b0e0ae26",
           "description": "description 1",
           "documentation": "https://getpayever.com/shopsystem/magento/",
           "marketplace": "https://marketplace.magento.com/payever-magento2-payments.html",
           "pluginFiles": []
         }
      """

  Scenario: get plugin form by channel
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"
    And I use DB fixture "common-plugin"
    And I use DB fixture "plugin-commands"
    And I send a GET request to "/api/plugin/channel/{{channelType}}/form"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "form": { }
      }
      """

  Scenario: get plugin by channel latest
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"
    And I use DB fixture "common-plugin"
    And I use DB fixture "plugin-commands"
    And I send a GET request to "/api/plugin/channel/{{channelType}}/latest"
    And print last response
    Then the response status code should be 404
    And the response should contain json:
      """
      {
           "statusCode": 404,
           "message": "Seems like we have no plugin version with given parameters.",
           "error": "Not Found"
         }
      """


  Scenario: publish plugin
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"
    And I use DB fixture "common-plugin"
    And I use DB fixture "plugin-commands"
    And set Authorization header to "plugins_ci", "UAyDaB5USZjz3RrSX"
    And I send a POST request to "/api/plugin/publish/{{channelType}}" with json:
    """
    {
      "filename": "https://host.com",
      "version": "1.0",
      "minCmsVersion": "1.0",
      "maxCmsVersion": "1.0"
    }
    """
    And print last response
    Then the response status code should be 201
    And the response should contain json:
      """
      {
           "_id": "*",
           "channel": "67d580f7-ebf5-40e4-9367-63b8b0e0ae26",
           "description": "description 1",
           "documentation": "https://getpayever.com/shopsystem/magento/",
           "marketplace": "https://marketplace.magento.com/payever-magento2-payments.html",
           "pluginFiles": [
             {
               "filename": "https://host.com",
               "version": "1.0",
               "minCmsVersion": "1.0",
               "maxCmsVersion": "1.0",
               "_id": "*"
             }
           ]
         }
      """

  Scenario: delete plugin by id
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"
    And I use DB fixture "common-plugin"
    And I use DB fixture "plugin-commands"
    And I send a DELETE request to "/api/plugin/7d6f6431-a7b1-40ab-b0b7-15aede2a2653"
    And print last response
    Then the response status code should be 204

  Scenario: patch plugin by id
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"
    And I use DB fixture "common-plugin"
    And I use DB fixture "plugin-commands"
    And I send a PATCH request to "/api/plugin/7d6f6431-a7b1-40ab-b0b7-15aede2a2653" with json:
    """
    {
      "description" : "description 1",
      "documentation" : "https://getpayever.com/shopsystem/magento/",
      "marketplace" : "https://marketplace.magento.com/payever-magento2-payments.html",
      "pluginFiles" : []
    }
    """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
           "_id": "7d6f6431-a7b1-40ab-b0b7-15aede2a2653",
           "channel": "67d580f7-ebf5-40e4-9367-63b8b0e0ae26",
           "description": "description 1",
           "documentation": "https://getpayever.com/shopsystem/magento/",
           "marketplace": "https://marketplace.magento.com/payever-magento2-payments.html",
           "pluginFiles": []
         }
      """

  Scenario: create plugin by channel
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"
    And I use DB fixture "common-plugin"
    And I use DB fixture "plugin-commands"
    And I send a POST request to "/api/plugin/channel/{{channelType}}" with json:
    """
    {
      "description" : "description 1",
      "documentation" : "https://getpayever.com/shopsystem/magento/",
      "marketplace" : "https://marketplace.magento.com/payever-magento2-payments.html",
      "pluginFiles" : []
    }
    """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
           "_id": "*",
           "channel": "67d580f7-ebf5-40e4-9367-63b8b0e0ae26",
           "description": "description 1",
           "documentation": "https://getpayever.com/shopsystem/magento/",
           "marketplace": "https://marketplace.magento.com/payever-magento2-payments.html",
           "pluginFiles": []
         }
      """