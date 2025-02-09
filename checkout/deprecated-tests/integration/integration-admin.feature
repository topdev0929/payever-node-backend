Feature: Integration API

  Background:
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [
          {
            "name": "admin",
            "permissions": [
              {
                "businessId": "5f02c4a8-929a-11e9-812b-7200004fe4c0",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario: Create new integration
    When I send a POST request to "/api/integration" with json:
      """
      {
        "name": "test",
        "category": "Test",
        "displayOptions": {
          "title": "Test"
        }
      }
      """

    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "name": "test",
        "category": "Test",
        "displayOptions": {
          "title": "Test",
          "_id": "*"
        },
        "_id": "*",
        "createdAt": "*",
        "updatedAt": "*",
        "__v": 0
      }
      """
