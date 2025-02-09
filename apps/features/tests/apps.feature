Feature: Apps
  Background:
    Given I remember as "businessId" following value:
      """
      "347e1cae-24f4-476f-bd1e-2b4c307949b9"
      """
    Given I remember as "appId" following value:
      """
      "a5ab9193-e02b-4aed-b75e-f9f3a5ced081"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "08a3fac8-43ef-4998-99aa-cabc97a39261",
        "email": "email@email.com",
        "roles": [
          {
            "name": "user"
          }
        ]
      }
      """
    Given I use DB fixture "apps"

  Scenario: Get apps
    When I send a GET request to "/api/apps"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "{{appId}}",
          "title": "Facebook Integration",
          "key": "facebook"
        }
      ]
      """

  Scenario: Create app
    When I send a POST request to "/api/apps" with json:
    """
    {
      "category": "shippings",
      "title": "New App",
      "key": "new",
      "scopes": [
        "read_products"
      ],
      "appUrl": "https://reza.com"
    }
    """
    And print last response
    Then the response status code should be 201
    And the response should contain json:
      """
      {
        "_id": "*",
        "title": "New App",
        "key": "new",
        "scopes": [
          "read_products"
        ],
        "apiKey": "12b306813d97930e292fe7d817bd5699b0ab4d744bd0c5a42555d16a6c79d54e"
      }
      """

  Scenario: Get app
    When I send a GET request to "/api/apps/{{appId}}"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{appId}}",
        "title": "Facebook Integration",
        "key": "facebook"
      }
      """

  Scenario: Update app
    When I send a PATCH request to "/api/apps/{{appId}}" with json:
    """
    {
      "title": "Changed App Name"
    }
    """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{appId}}",
        "title": "Changed App Name",
        "key": "facebook"
      }
      """

  Scenario: Delete app
    When I send a DELETE request to "/api/apps/{{appId}}"
    And print last response
    Then the response status code should be 200
