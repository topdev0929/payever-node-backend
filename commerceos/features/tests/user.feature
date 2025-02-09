Feature: User apps
  Background: constants
    Given I load constants from "features/fixtures/const.ts"

  Scenario: Get apps as anonymous
    Given I am not authenticated
    When I send a GET request to "/api/apps/user"
    Then the response status code should be 403

  Scenario: Get user apps
    Given I use DB fixture "dashboard"
    And I use DB fixture "default"
    And I use DB fixture "user"
    And I authenticate as a user with the following data:
      """
      {
        "id": "1d2a38e4-3955-4e29-9099-e74c72a98336",
        "roles": [
          {
            "name": "user",
            "permissions": [
              {
                "businessId": "0c3291a6-da00-48a1-a721-699dec0ba5bc",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a GET request to "/api/apps/user"
    Then the response status code should be 200
    And print last response
    And the response should contain json:
      """
      [
        {
          "code": "settings",
          "installed": false
        }
      ]
      """

  Scenario: Get admin apps
    Given I use DB fixture "dashboard"
    And I use DB fixture "default"
    And I use DB fixture "user"
    And I authenticate as a user with the following data:
      """
      {
        "id": "bf43f146-018c-4356-9515-3c717cd7b218",
        "roles": [
          {
            "name": "admin",
            "permissions": [
              {
                "businessId": "0c3291a6-da00-48a1-a721-699dec0ba5bc",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a GET request to "/api/apps/admin"
    Then the response status code should be 200
    And print last response
    And the response should contain json:
      """
      [
        {
          "code": "settings",
          "installed": false
        }
      ]
      """

  Scenario: Get partner apps
    Given I use DB fixture "dashboard"
    And I use DB fixture "default"
    And I use DB fixture "user"
    And I authenticate as a user with the following data:
      """
      {
        "id": "bf43f146-018c-4356-9515-3c717cd7b218",
        "roles": [
          {
            "name": "admin",
            "permissions": [
              {
                "businessId": "0c3291a6-da00-48a1-a721-699dec0ba5bc",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a GET request to "/api/apps/partner"
    Then print last response
    And the response should contain json:
      """
      [
        {
          "_id": "{{DASHBOARD_APP_APP2_ID}}",
          "allowedAcls": {
            "create": true,
            "delete": false
          },
          "bootstrapScriptUrl": "http://bootstrapScriptUrl2",
          "code": "settings",
          "dashboardInfo": {},
          "default": false,
          "installed": true,
          "microUuid": "{{DASHBOARD_APP_APP2_ID}}",
          "order": 2,
          "platformHeader": {},
          "setupStatus": "notStarted",
          "tag": "tag2",
          "url": "http://business-url2"
        }
      ]
      """
    And the response status code should be 200

  Scenario: Toggle user app installed
    Given I use DB fixture "dashboard"
    And I use DB fixture "default"
    And I use DB fixture "user"
    And I authenticate as a user with the following data:
      """
      {
        "id": "363e68d3-b077-4cb7-9b2c-80ec4d5adefe",
        "roles": [
          {
            "name": "user",
            "permissions": [
              {
                "businessId": "0c3291a6-da00-48a1-a721-699dec0ba5bc",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a PATCH request to "/api/apps/user/toggle-installed/{{DASHBOARD_APP_APP1_ID}}" with json:
      """
      {
        "microUuid": "{{DASHBOARD_APP_APP1_ID}}",
        "installed": true
      }
      """
    Then the response status code should be 201
    And model "User" with id "363e68d3-b077-4cb7-9b2c-80ec4d5adefe" should contain json:
      """
      {
        "installedApps": [
          {
            "app": "{{DASHBOARD_APP_APP1_ID}}",
            "installed": true
          }
        ]
      }
      """

  Scenario: Toggle admin app installed
    Given I use DB fixture "dashboard"
    And I use DB fixture "default"
    And I use DB fixture "user"
    And I authenticate as a user with the following data:
      """
      {
        "id": "363e68d3-b077-4cb7-9b2c-80ec4d5adefe",
        "roles": [
          {
            "name": "admin",
            "permissions": [
              {
                "businessId": "0c3291a6-da00-48a1-a721-699dec0ba5bc",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a POST request to "/api/apps/admin/toggle-installed" with json:
      """
      {
        "microUuid": "{{DASHBOARD_APP_APP2_ID}}",
        "installed": true
      }
      """
    Then the response status code should be 201
    And model "User" with id "363e68d3-b077-4cb7-9b2c-80ec4d5adefe" should contain json:
      """
      {
        "installedApps": [
          {
            "app": "{{DASHBOARD_APP_APP2_ID}}",
            "installed": true
          }
        ]
      }
      """

  Scenario: Toggle partner app installed
    Given I use DB fixture "dashboard"
    And I use DB fixture "default"
    And I use DB fixture "user"
    And I authenticate as a user with the following data:
      """
      {
        "id": "363e68d3-b077-4cb7-9b2c-80ec4d5adefc",
        "roles": [
          {
            "name": "admin",
            "permissions": [
              {
                "businessId": "0c3291a6-da00-48a1-a721-699dec0ba5bc",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a POST request to "/api/apps/partner/toggle-installed" with json:
      """
      {
        "microUuid": "{{DASHBOARD_APP_APP2_ID}}",
        "installed": true
      }
      """
    Then model "User" with id "363e68d3-b077-4cb7-9b2c-80ec4d5adefc" should contain json:
      """
      {
        "installedApps": [
          {
            "app": "{{DASHBOARD_APP_APP2_ID}}",
            "installed": true
          }
        ]
      }
      """
    And the response status code should be 201
