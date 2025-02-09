Feature: Statistics endpoints
  Background:
    Given I remember as "businessId" following value:
      """
      "568192aa-36ea-48d8-bc0a-8660029e6f72"
      """
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario: Get widget types.
    Given I use DB fixture "widget"
    When I send a GET request to "/api/business/{{businessId}}/widgetData/widget-types"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "widgetSize": [
          "Small",
          "Medium",
          "Large"
        ],
        "widgetType": [
          "DetailedNumbers",
          "LineGraph",
          "Percentage",
          "SimpleNumbers",
          "TwoColumns"
        ]
      }
      """

  Scenario: Get widget data for checkout. Should return Widget does not exist.
    Given I use DB fixture "widget"
    When I send a GET request to "/api/business/{{businessId}}/widgetData/checkout"
    Then print last response
    And the response status code should be 404
    And the response should contain json:
      """
      {
          "statusCode": 404,
          "message": "Widget does not exist.",
          "error": "Not Found"
      }
      """
