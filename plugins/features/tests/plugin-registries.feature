Feature: Plugin registry

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

  Scenario: add plugin instance regstry
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"
    And I use DB fixture "common-plugin"
    And I use DB fixture "plugin-commands"
    And I send a POST request to "/api/plugin/registry/register" with json:
      """
      {
        "channel" : "67d580f7-ebf5-40e4-9367-63b8b0e0ae26",
        "acknowledgedCommands": ["d73635ff-51da-41ca-bfab-f08052de6163"],
        "businessIds": ["dac8cff5-dfc5-4461-b0e3-b25839527304"],
        "cmsVersion": "cms",
        "host": "http",
        "pluginVersion": "1.00",
        "supportedCommands": ["set-command-host"]
      }
      """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
           "acknowledgedCommands": [
             "d73635ff-51da-41ca-bfab-f08052de6163"
           ],
           "businessIds": [
             "dac8cff5-dfc5-4461-b0e3-b25839527304"
           ],
           "supportedCommands": [
             "set-command-host"
           ],
           "_id": "*",
           "channel": "67d580f7-ebf5-40e4-9367-63b8b0e0ae26",
           "cmsVersion": "cms",
           "host": "http",
           "pluginVersion": "1.00"
         }
      """
    Then I send a POST request to "/api/plugin/registry/ack/d73635ff-51da-41ca-bfab-f08052de6163" with json:
      """
      {
        "channel" : "67d580f7-ebf5-40e4-9367-63b8b0e0ae26",
        "host": "http"
      }
      """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
       {
           "acknowledgedCommands": [
             {
               "_id": "d73635ff-51da-41ca-bfab-f08052de6163",
               "createdAt": "2019-08-09T09:09:44.281Z",
               "name": "set-live-host",
               "value": "https://stub-live.host"
             }
           ],
           "businessIds": [
             "dac8cff5-dfc5-4461-b0e3-b25839527304"
           ],
           "supportedCommands": [
             "set-command-host"
           ],
           "_id": "*",
           "channel": "67d580f7-ebf5-40e4-9367-63b8b0e0ae26",
           "cmsVersion": "cms",
           "host": "http",
           "pluginVersion": "1.00"
         }
      """

  Scenario: unregister plugin instance regstry
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"
    And I use DB fixture "common-plugin"
    And I use DB fixture "plugin-commands"
    And I send a POST request to "/api/plugin/registry/unregister" with json:
      """
      {
        "channel" : "67d580f7-ebf5-40e4-9367-63b8b0e0ae26",
        "host": "http"
      }
      """
    And print last response
    Then the response status code should be 200
