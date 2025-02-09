Feature: Themes
  Background: constants
    Given I remember as "businessId" following value:
      """
      "_id-of-existing-business"
      """
    Given I remember as "userId" following value:
      """
      "_id-of-existing-user"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{ID_OF_CONTACT_2}}",
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ],
            "tags": [],
            "name": "merchant"
          }
        ]
      }
      """
    Given I use DB fixture "business"

  Scenario: Get themes
    Given I use DB fixture "themes"
    When I send a GET request to "/api/business/{{businessId}}/themes"
    Then I store a response as "response"
    And the response code should be 200
    And the response should contain json:
      """
      {
        "currentTheme": "default",
        "themes": [
          {
            "_id": "*",
            "business": "{{businessId}}",
            "name": "default",
            "isDefault": true,
            "settings": {
              "bgChatColor": "#2ea6ff",
              "accentColor": "#2ea6ff",
              "messagesTopColor": "#2ea6ff",
              "messagesBottomColor": "#2ea6ff",
              "messageAppColor": "#2ea6ff"
            }
          },
          {
            "_id": "*",
            "business": "{{businessId}}",
            "name": "light",
            "isDefault": false,
            "settings": {
              "bgChatColor": "#2ea6ff",
              "accentColor": "#2ea6ff",
              "messagesTopColor": "#2ea6ff",
              "messagesBottomColor": "#2ea6ff",
              "messageAppColor": "#2ea6ff"
            }
          }
        ]
      }
      """

  Scenario: Create themes when it does not exist
    When I send a GET request to "/api/business/{{businessId}}/themes"
    Then print last response
    Then I store a response as "response"
    And the response code should be 200
    And the response should contain json:
      """
      {
        "currentTheme": "default",
        "themes": [
          {
            "_id": "*",
            "business": "{{businessId}}",
            "name": "default",
            "isDefault": true
          },
          {
            "_id": "*",
            "business": "{{businessId}}",
            "name": "light",
            "isDefault": false
          },
          {
            "_id": "*",
            "business": "{{businessId}}",
            "name": "evening",
            "isDefault": false
          },
          {
            "_id": "*",
            "business": "{{businessId}}",
            "name": "midnight",
            "isDefault": false
          }
        ]
      }
      """

  Scenario: Update theme setting
    Given I use DB fixture "themes"
    When I send a PATCH request to "/api/business/{{businessId}}/themes/{{businessId}}" with json:
      """
      {
        "settings": {
          "bgChatColor": "#2ea699",
          "messageWidgetBlurValue ": "23px",
          "alwaysOpen": true
        }
      }
      """
    Then the response code should be 200
    And the response should contain json:
      """
      {
        "settings": {
          "bgChatColor": "#2ea699",
          "messageWidgetBlurValue ": "23px",
          "alwaysOpen": true
        }
      }
      """

  Scenario: Update theme setting custom preset colors
    Given I use DB fixture "themes"
    When I send a PATCH request to "/api/business/{{businessId}}/themes/{{businessId}}" with json:
      """
      {
        "settings": {
          "customPresetColors": [
            {
              "accentColor": "#2ea699"
            }
          ],
          "messageWidgetBlurValue ": "23px",
          "alwaysOpen": true
        }
      }
      """
    Then the response code should be 200
    And the response should contain json:
      """
      {
        "settings": {
          "customPresetColors": [
            {
              "accentColor": "#2ea699"
            }
          ],
          "messageWidgetBlurValue ": "23px",
          "alwaysOpen": true
        }
      }
      """

  Scenario: Update default theme
    Given I use DB fixture "themes"
    When I send a PATCH request to "/api/business/{{businessId}}/themes/xyz" with json:
      """
      {
        "isDefault": true
      }
      """
    And I send a GET request to "/api/business/{{businessId}}/themes"
    Then print last response
    And the response code should be 200
    And the response should contain json:
      """
      {
        "currentTheme": "light",
        "themes": [
          {
            "_id": "*",
            "business": "{{businessId}}",
            "name": "default",
            "isDefault": false
          },
          {
            "_id": "*",
            "business": "{{businessId}}",
            "name": "light",
            "isDefault": true
          }
        ]
      }
      """
