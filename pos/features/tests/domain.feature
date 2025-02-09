Feature: Terrminal management
  Background:
    Given I remember as "businessId" following value:
      """
      "dac8cff5-dfc5-4461-b0e3-b25839527304"
      """
    Given I remember as "terminalId" following value:
      """
      "dac8cff5-dfc5-4461-b0e3-b25839527305"
      """
    Given I remember as "terminalConfigId" following value:
      """
      "dac8cff5-dfc5-4461-b0e3-b25839527308"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "08a3fac8-43ef-4998-99aa-cabc97a39261",
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": [
                  {
                    "microservice": "pos",
                    "rea": true
                  }
                ]
              }
            ]
          }
        ]
      }
      """

  Scenario: get terminal by domain
    Given I use DB fixture "businesses"
    And I use DB fixture "terminal"
    When I send a GET request to "/api/terminal/by-domain?domain=new domain"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "integrationSubscriptions": [
          "*"
        ],
        "active": false,
        "defaultLocale": "en",
        "live": true,
        "locales": [
          "en"
        ],
        "_id": "*",
        "businessId": "{{businessId}}",
        "business": {
          "integrationSubscriptions": [],
          "terminals": [
            "dac8cff5-dfc5-4461-b0e3-b25839527305",
            "dac8cff5-dfc5-4461-b0e3-b25839527315"
          ],
          "channelSets": [],
          "subscriptions": [],
          "_id": "dac8cff5-dfc5-4461-b0e3-b25839527304",
          "defaultLanguage": "en",
          "id": "{{businessId}}"
        },
        "channelSet": "*",
        "logo": "logo_url",
        "message": "my terminal",
        "name": "test it",
        "id": "*"
      }
      """
