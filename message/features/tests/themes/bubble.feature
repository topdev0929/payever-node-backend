Feature: Bubble
  Background: constants
    Given I remember as "businessId" following value:
      """
      "_id-of-existing-business"
      """
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["messages"], "result": [] }
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

  Scenario: Get bubble
    Given I use DB fixture "bubble"
    When I send a GET request to "/api/business/{{businessId}}/bubble"
    Then I store a response as "response"
    And the response code should be 200
    And the response should contain json:
      """
      {
        "_id": "*",
        "business": "{{businessId}}",
        "showBubble": true,
        "showNotifications": true,
        "brand": "payever",
        "style": "circle",
        "layout": "logo_text",
        "logo": "",
        "text": "",
        "bgColor": "#111111",
        "textColor": "#ffffff",
        "boxShadow": "#9a9a9aff",
        "roundedValue": "12px"
      }
      """

  Scenario: Create bubble when it does not exist
    When I send a GET request to "/api/business/{{businessId}}/bubble"
    Then print last response
    Then I store a response as "response"
    And the response code should be 200
    And the response should contain json:
      """
      {
        "_id": "*",
        "business": "{{businessId}}",
        "showBubble": true,
        "showNotifications": true,
        "brand": "payever",
        "style": "circle",
        "layout": "logo_text",
        "logo": "",
        "text": "",
        "bgColor": "#111111",
        "textColor": "#ffffff",
        "boxShadow": "#9a9a9aff",
        "roundedValue": "12px",
        "businessDocument": {
          "name": "business-number-one",
          "logo": "business-logo.png"
        },
        "blurBox": ""
      }
      """

  Scenario: Update bubble
    Given I use DB fixture "bubble"
    When I send a PATCH request to "/api/business/{{businessId}}/bubble" with json:
      """
      {
        "bgColor": "#2ea699"
      }
      """
    Then the response code should be 200
    And the response should contain json:
      """
      {
        "bgColor": "#2ea699"
      }
      """

  Scenario: Update bubble when it does not exist
    When I send a PATCH request to "/api/business/{{businessId}}/bubble" with json:
      """
      {
        "bgColor": "#2ea699"
      }
      """
    Then print last response
    And the response code should be 200
    And the response should contain json:
      """
      {
        "_id": "*",
        "business": "{{businessId}}",
        "showBubble": true,
        "showNotifications": true,
        "brand": "payever",
        "style": "circle",
        "layout": "logo_text",
        "logo": "",
        "text": "",
        "bgColor": "#2ea699",
        "textColor": "#ffffff",
        "boxShadow": "#9a9a9aff",
        "roundedValue": "12px",
        "businessDocument": {
          "name": "business-number-one",
          "logo": "business-logo.png"
        },
        "blurBox": ""
      }
      """
