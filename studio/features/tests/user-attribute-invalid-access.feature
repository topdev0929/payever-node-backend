Feature: Attribute features
  Background:
    Given I use DB fixture "user.attribute"
    Given I use DB fixture "business"
    Given I remember as "businessId" following value:
      """
        "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
      """
    Given I remember as "businessId2" following value:
      """
        "3b1eb897-a009-4ff6-a850-3b1d3399f147"
      """
    Given I remember as "userMediaId" following value:
      """
        "7d2a9404-e07a-477f-839d-71f591cf1317"
      """
    Given I remember as "attributeId" following value:
      """
        "17526ce8-94d3-4dab-99cd-667997bfa356"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "email": "email@test.com",
        "roles": [{
          "name": "merchant",
          "permissions": [{"businessId": "{{businessId2}}", "acls": []}]
        }]
      }
      """

  Scenario: Create user attribute different business
    When I send a POST request to "/api/{{businessId2}}/attribute" with json:
      """
      {
    	"businessId": "{{businessId}}",
        "icon": "http://test.com/white.jpg",
        "name": "white",
        "type": "color"
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

  Scenario: Update user attribute different business
    When I send a PATCH request to "/api/{{businessId2}}/attribute/{{attributeId}}" with json:
      """
      {
    	"businessId": "{{businessId}}",
        "icon": "http://test.com/white.jpg",
        "name": "white",
        "type": "color"
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

  Scenario: Get user attribute by id different business
    When I send a GET request to "/api/{{businessId2}}/attribute/{{attributeId}}"
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

  Scenario: Delete user attribute by id
    When I send a DELETE request to "/api/{{businessId2}}/attribute/{{attributeId}}"
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

  Scenario: Get user attribute different business
    When I send a GET request to "/api/{{businessId2}}/attribute?page=1&limit=3"
    Then print last response
    Then the response status code should be 200
    And the response should not contain json:
      """
      [
        {
          "_id": "*"
        }
      ]
      """
