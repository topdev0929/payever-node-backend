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

  Scenario: add Api Key
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"
    And I send a POST request to "/api/business/dac8cff5-dfc5-4461-b0e3-b25839527304/shopsystem/type/{{channelType}}" with json:
      """
      {
      }
      """
    And print last response
    Then the response status code should be 200

  Scenario: get shop system by id
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"
    And I send a GET request to "/api/business/dac8cff5-dfc5-4461-b0e3-b25839527304/shopsystem/dac8cff5-dfc5-4461-b0e3-b25839527304"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
           "apiKeys": [
             "dac8cff5-dfc5-4461-b0e3-b25839527304"
           ],
           "_id": "dac8cff5-dfc5-4461-b0e3-b25839527304",
           "channel": "67d580f7-ebf5-40e4-9367-63b8b0e0ae26"
         }
      """

  Scenario: get shop system by channel
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"
    And I send a GET request to "/api/business/dac8cff5-dfc5-4461-b0e3-b25839527304/shopsystem/type/{{channelType}}"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
           "apiKeys": [
             "dac8cff5-dfc5-4461-b0e3-b25839527304"
           ],
           "_id": "dac8cff5-dfc5-4461-b0e3-b25839527304",
           "channel": {
             "enabled": true,
             "enabledByDefault": false,
             "customPolicy": false,
             "_id": "*",
             "legacyId": 7,
             "type": "magento"
           }
         }
      """

  Scenario: get shop system
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"
    And I send a GET request to "/api/business/dac8cff5-dfc5-4461-b0e3-b25839527304/shopsystem"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
       [
           {
             "apiKeys": [
               "dac8cff5-dfc5-4461-b0e3-b25839527304"
             ],
             "_id": "dac8cff5-dfc5-4461-b0e3-b25839527304",
             "channel": {
               "enabled": true,
               "enabledByDefault": false,
               "customPolicy": false,
               "_id": "*",
               "legacyId": 7,
               "type": "magento"
             }
           }
         ]
      """

  Scenario: delete shop system by id
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"
    And I send a DELETE request to "/api/business/dac8cff5-dfc5-4461-b0e3-b25839527304/shopsystem/dac8cff5-dfc5-4461-b0e3-b25839527304"
    And print last response
    Then the response status code should be 204
