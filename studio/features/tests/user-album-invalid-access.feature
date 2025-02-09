Feature: User album features
  Background:
    Given I use DB fixture "user.album"
    Given I use DB fixture "business"
    Given I remember as "businessId" following value:
      """
        "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
      """
    Given I remember as "businessId2" following value:
      """
        "3b1eb897-a009-4ff6-a850-3b1d3399f147"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "email": "email@test.com",
        "roles": [{
          "name": "merchant",
          "permissions": [
            {"businessId": "{{businessId}}", "acls": []}
          ]
        }]
      }
      """
    Given I remember as "albumId1Lvl0" following value:
      """
        "0ebb5ea6-61de-46f7-833f-599018b7861f"
      """

  Scenario: Create user album with different businessId
    When I send a POST request to "/api/{{businessId}}/album" with json:
      """
      {
        "name": "false",
        "businessId": "{{businessId2}}"
      }
      """
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
      """
      {
        "statusCode": 403,
        "error": "Forbidden",
        "message": "Access Denied"
      }
      """

  Scenario: Update user album with different businessId
    When I send a PATCH request to "/api/{{businessId}}/album/{{albumId1Lvl0}}" with json:
      """
      {
        "albumId": "{{albumId1Lvl0}}",
        "name": "false",
        "businessId": "{{businessId2}}"
      }
      """
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
      """
      {
        "statusCode": 403,
        "error": "Forbidden",
        "message": "Access Denied"
      }
      """

  Scenario: Get album id different business
    When I send a GET request to "/api/{{businessId2}}/album/{{albumId1Lvl0}}"
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
      """
      {
        "error": "Forbidden",
        "statusCode": 403
      }
      """

  Scenario: Get album by parent different business
    When I send a GET request to "/api/{{businessId2}}/album/parent/{{albumId1Lvl0}}"
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
      """
      {
        "error": "Forbidden",
        "statusCode": 403
      }
      """

  Scenario: Get album by ancestor different business
    When I send a GET request to "/api/{{businessId2}}/album/ancestor/{{albumId1Lvl0}}"
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
      """
      {
        "error": "Forbidden",
        "statusCode": 403
      }
      """

  Scenario: Delete album id different business
    When I send a DELETE request to "/api/{{businessId2}}/album/{{albumId1Lvl0}}"
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
      """
      {
        "error": "Forbidden",
        "statusCode": 403
      }
      """
