Feature: Admin
  Background:
    Given I remember as "terminalId" following value:
      """
      "dac8cff5-dfc5-4461-b0e3-b25839527305"
      """
    Given I remember as "terminalAccessId" following value:
      """
      "dac8cff5-dfc5-4461-b0e3-b25839527308"
      """  
    Given I remember as "businessId" following value:
      """
      "dac8cff5-dfc5-4461-b0e3-b25839527304"
      """

  Scenario: get terminals list for admin
    Given I use DB fixture "terminal"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "85547e38-dfe5-4282-b1ae-c5542267f39e",
        "roles": [{
          "name": "admin"
        }]
      }
    """
    When I send a GET request to "/api/admin/terminals?businessIds={{businessId}}"
    Then print last response
    Then response status code should be 200
    And response should contain json:
    """
    {
      "terminals": [
        {
          "_id": "{{terminalId}}"
        },
        {
          "_id": "dac8cff5-dfc5-4461-b0e3-b25839527315"
        }
      ],
      "page": 1,
      "total": 2
    }
    """

  Scenario: create terminal
    Given I use DB fixture "businesses"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "85547e38-dfe5-4282-b1ae-c5542267f39e",
        "roles": [{
          "name": "admin"
        }]
      }
    """
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
    When I send a POST request to "/api/admin/business/{{businessId}}/terminals" with json:
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
        "integrationSubscriptions": [],
        "active": false,
        "defaultLocale": "en",
        "live": true,
        "locales": [
          "en"
        ],
        "name": "new terminal",
        "logo": "logo_url",
        "business": {
          "_id": "dac8cff5-dfc5-4461-b0e3-b25839527304"
        },
        "_id": "*"
      }
      """

  Scenario: update terminals by terminal id
    Given I use DB fixture "businesses"
    Given I use DB fixture "terminal"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "85547e38-dfe5-4282-b1ae-c5542267f39e",
        "roles": [{
          "name": "admin"
        }]
      }
    """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "terminals",
          {}
         ],
        "result": {}
      }
      """
    When I send a PATCH request to "/api/admin/business/{{businessId}}/terminals/{{terminalId}}" with json:
    """
    {
      "message": "new message",
      "logo": "new_logo_url"
    }
    """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
       {
         "integrationSubscriptions": ["dac8cff5-dfc5-4461-b0e3-b25839527306"],
         "active": false,
         "defaultLocale": "en",
         "locales": [
           "en"
         ],
         "name": "test it",
         "logo": "new_logo_url",
         "business": {
           "_id": "dac8cff5-dfc5-4461-b0e3-b25839527304"
         },
         "_id": "*"
       }
      """

  Scenario: Set terminal active by terminal id
    Given I use DB fixture "businesses"
    And I use DB fixture "terminal"
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "85547e38-dfe5-4282-b1ae-c5542267f39e",
        "roles": [{
          "name": "admin"
        }]
      }
    """
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "terminals",
          {}
         ],
        "result": {}
      }
      """
    When I send a PATCH request to "/api/admin/business/{{businessId}}/terminals/{{terminalId}}/active"
    And print last response
    Then the response status code should be 200
 
 Scenario: update Access Config of terminal
    Given I use DB fixture "businesses"
    And I use DB fixture "terminal"
    When I send a PATCH request to "/api/admin/terminals/{{terminalId}}/config" with json:
    """
    {
      "internalDomain": "newdomain",
      "internalDomainPattern": "newpattern",
      "isLive": false,
      "isLocked": true
    }
    """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "internalDomain": "newdomain",
        "internalDomainPattern": "newpattern",
        "isLive": false,
        "isLocked": true,
        "_id": "{{terminalAccessId}}"
      }
      """

  Scenario: delete terminal
    Given I use DB fixture "businesses"
    Given I use DB fixture "terminal"
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
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "85547e38-dfe5-4282-b1ae-c5542267f39e",
        "roles": [{
          "name": "admin"
        }]
      }
    """
    When I send a DELETE request to "/api/admin/terminals/{{terminalId}}"
    Then the response status code should be 200

  Scenario: Delete terminal without admin permission
    Given I authenticate as a user with the following data:
    """
      {
        "email": "email@test.com",
        "id": "8a13bd00-90f1-11e9-9f67-7200004fe4c0",
        "roles": [{
          "name": "merchant",
          "permissions": [
            {"businessId": "6502b371-4cda-4f1d-af9c-f9c5c886c455", "acls": []},
            {"businessId": "fa8b1d32-8d5c-4839-9ea6-4af777098465", "acls": []}
          ]
        }]
      }
    """
    When I send a DELETE request to "/api/admin/terminals/{{terminalId}}"
    Then the response status code should be 403
