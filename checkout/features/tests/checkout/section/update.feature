Feature: Section API

  Scenario: Create new section
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "admin",
            "permissions": []
          }
        ]
      }
      """
    When I send a POST request to "/api/sections" with json:
      """
      {
        "code": "order",
        "order": 1,
        "defaultEnabled": true
      }
      """
    Then print last response
    And the response status code should be 201
    Then I look for model "CheckoutSection" by following JSON and remember as "found":
      """
      {
        "code": "order"
      }
      """
    And stored value "found" should contain json:
      """
      {
        "code": "order",
        "order": 1,
        "defaultEnabled": true
      }
      """

  Scenario: Create new section, endpoint permission
    Given I am not authenticated
    When I send a POST request to "/api/sections" with json:
      """
      {
        "code": "order",
        "order": 1,
        "defaultEnabled": true
      }
      """
    Then print last response
    And the response status code should be 403
