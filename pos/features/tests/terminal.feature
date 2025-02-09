@terminal-management
Feature: Terminal management
  Background:
    Given I remember as "businessId" following value:
      """
      "dac8cff5-dfc5-4461-b0e3-b25839527304"
      """
    Given I remember as "terminalId" following value:
      """
      "dac8cff5-dfc5-4461-b0e3-b25839527305"
      """
    Given I remember as "terminalIdTwo" following value:
      """
      "dac8cff5-dfc5-4461-b0e3-b25839527315"
      """
    Given I remember as "integrationSubId" following value:
      """
      "dac8cff5-dfc5-4461-b0e3-b25839527306"
      """
    Given I remember as "channelSetId" following value:
      """
      "dac8cff5-dfc5-4461-b0e3-b25839527307"
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
                    "create": true
                  },
                  {
                    "microservice": "pos",
                    "update": true
                  },
                  {
                    "microservice": "pos",
                    "delete": true
                  },
                  {
                    "microservice": "pos",
                    "read": true
                  }
                ]
              }
            ]
          }
        ]
      }
      """

  Scenario: create terminal
    Given I use DB fixture "businesses"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "terminals",
          {
            "name": "new terminal",
            "logo": "logo_url"
          }
         ],
        "result": {}
      }
      """
    When I send a POST request to "/api/business/{{businessId}}/terminal" with json:
    """
    {
      "name": "new terminal",
      "logo": "logo_url"
    }
    """
    And print last response
    Then the response status code should be 201
    And the response should contain json:
      """
      {
        "channelSets": [
          {
            "_id": "*",
            "type": "terminal"
          },
          {
            "_id": "*",
            "type": "external"
          },
          {
            "_id": "*",
            "type": "self_checkout"
          }
        ],
        "integrationSubscriptions": [],
        "active": false,
        "defaultLocale": "en",
        "live": true,
        "locales": [
          "en"
        ],
        "_id": "*",
        "businessId": "dac8cff5-dfc5-4461-b0e3-b25839527304",
        "name": "new terminal",
        "logo": "logo_url",
        "business": {
          "integrationSubscriptions": [],
          "terminals": [
            "dac8cff5-dfc5-4461-b0e3-b25839527305",
            "dac8cff5-dfc5-4461-b0e3-b25839527315"
          ],
          "subscriptions": [],
          "defaultLanguage": "en"
        },
        "channelSet": {
          "type": "terminal"
        },
        "id": "*"
      }
      """
    When I send a GET request to "/api/business/{{businessId}}/terminal/getDefaultLanguage"
    And print last response
    Then the response status code should be 200

  Scenario: Delete terminal
    Given I use DB fixture "businesses"
    And I use DB fixture "terminal"
    And I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "terminals",
          {
            "query": {
              "match_phrase": {
                "mongoId": "{{terminalId}}"
              }
            }
          }
         ],
        "result": {}
      }
      """
    When I send a DELETE request to "/api/business/{{businessId}}/terminal/{{terminalId}}"
    And print last response
    Then the response status code should be 200

  Scenario: Delete terminal of business with single terminal
    Given I use DB fixture "single-terminal-businesses"
    And I use DB fixture "terminal"
    When I send a DELETE request to "/api/business/{{businessId}}/terminal/{{terminalId}}"
    And print last response
    Then the response status code should be 412
    And the response should contain json:
      """
      {
        "message": "Can not delete last terminal"
      }
      """

  Scenario: Get terminals
    Given I use DB fixture "businesses"
    And I use DB fixture "terminal"
    When I send a GET request to "/api/business/{{businessId}}/terminal"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "integrationSubscriptions": [
            "{{{integrationSubId}}"
          ],
          "active": false,
          "defaultLocale": "en",
          "live": true,
          "locales": [
            "en"
          ],
          "_id": "{{terminalId}}",
          "businessId": "{{businessId}}",
          "channelSet": "{{channelSetId}}",
          "logo": "logo_url",
          "message": "my terminal",
          "name": "test it"
        },
        {
          "integrationSubscriptions": [
            "{{{integrationSubId}}"
          ],
          "active": false,
          "defaultLocale": "en",
          "live": true,
          "locales": [
            "en"
          ],
          "_id": "{{terminalIdTwo}}",
          "businessId": "{{businessId}}",
          "channelSet": "{{channelSetId}}",
          "logo": "logo_url",
          "message": "my terminal",
          "name": "test it two"
        }
      ]
      """

  Scenario: Get terminals by terminal id
    Given I use DB fixture "businesses"
    And I use DB fixture "terminal"
    When I send a GET request to "/api/business/{{businessId}}/terminal/{{terminalId}}"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "integrationSubscriptions": [
          "{{{integrationSubId}}"
        ],
        "active": false,
        "defaultLocale": "en",
        "live": true,
        "locales": [
          "en"
        ],
        "_id": "{{terminalId}}",
        "businessId": "{{businessId}}",
        "business": {
          "integrationSubscriptions": [],
          "terminals": [
            "dac8cff5-dfc5-4461-b0e3-b25839527305",
            "dac8cff5-dfc5-4461-b0e3-b25839527315"
          ],
          "channelSets": [],
          "subscriptions": [],
          "_id": "{{businessId}}",
          "defaultLanguage": "en"
        },
        "channelSet": "{{channelSetId}}",
        "logo": "logo_url",
        "message": "my terminal",
        "name": "test it"
      }
      """

  Scenario: Update terminals by terminal id
    Given I use DB fixture "businesses"
    And I use DB fixture "terminal"
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "terminals",
          {
            "_id": "{{terminalId}}"
          }
         ],
        "result": {}
      }
      """
    When I send a PATCH request to "/api/business/{{businessId}}/terminal/{{terminalId}}" with json:
    """
    {
      "message": "new message",
      "live": false,
      "logo": "new_logo_url"
    }
    """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "integrationSubscriptions": [
          "{{integrationSubId}}"
        ],
        "active": false,
        "defaultLocale": "en",
        "live": true,
        "locales": [
          "en"
        ],
        "_id": "{{terminalId}}",
        "business": {
          "_id": "{{businessId}}"
        },
        "logo": "new_logo_url",
        "message": "new message",
        "name": "test it"
      }
      """

  Scenario: Make terminal active by terminal id
    Given I use DB fixture "businesses"
    And I use DB fixture "terminal"
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "terminals",
          {
            "_id": "{{terminalId}}",
            "active": true
          }
         ],
        "result": {}
      }
      """
    When I send a PATCH request to "/api/business/{{businessId}}/terminal/{{terminalId}}/active"
    And print last response
    Then the response status code should be 200


  Scenario: Check valid name
    Given I use DB fixture "businesses"
    And I use DB fixture "terminal"
    When I send a GET request to "/api/business/{{businessId}}/terminal/isValidName?name=test1"
    And print last response
    And the response should contain json:
    """
    {
      "result": true
    }
    """

  # Scenario: Check valid name - special char
  #   Given I use DB fixture "businesses"
  #   And I use DB fixture "terminal"
  #   When I send a GET request to "/api/business/{{businessId}}/terminal/isValidName?name=test!"
  #   And print last response
  #   And the response should contain json:
  #   """
  #   {
  #     "result": false
  #   }
  #   """

   Scenario: Check valid name - occupied
    Given I use DB fixture "businesses"
    And I use DB fixture "terminal"
    When I send a GET request to "/api/business/{{businessId}}/terminal/isValidName?name=test%20it"
    And print last response
    And the response should contain json:
    """
    {
      "result": false
    }
    """
