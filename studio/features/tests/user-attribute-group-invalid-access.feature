Feature: Attribute features
  Background:
    Given I use DB fixture "user.attribute.group"
    Given I use DB fixture "business"
    Given I remember as "businessId" following value:
      """
        "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
      """
    Given I remember as "businessId2" following value:
      """
        "3b1eb897-a009-4ff6-a850-3b1d3399f147"
      """
    Given I remember as "attributeGroupId" following value:
      """
        "71b50c01-129d-406b-b8b4-f82c3b95b4f4"
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

  Scenario: Create user attribute group different business group
    When I send a POST request to "/api/{{businessId2}}/attribute/group" with json:
      """
      {
        "businessId": "{{businessId}}",
        "name": "media detail"
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

  Scenario: Update user attribute group different business
    When I send a PATCH request to "/api/{{businessId2}}/attribute/group/{{attributeGroupId}}" with json:
      """
      {
        "businessId": "{{businessId}}",
        "name": "media detail"
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

  Scenario: Get user attribute group by id different business
    When I send a GET request to "/api/{{businessId2}}/attribute/group/{{attributeGroupId}}"
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

  Scenario: Delete user attribute group by id
    When I send a DELETE request to "/api/{{businessId2}}/attribute/group/{{attributeGroupId}}"
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
