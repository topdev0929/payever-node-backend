Feature: Attribute features
  Background:
    Given I use DB fixture "user.attribute.group"
    Given I use DB fixture "business"
    Given I remember as "businessId" following value:
      """
        "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
      """
    Given I remember as "userMediaId" following value:
      """
        "7d2a9404-e07a-477f-839d-71f591cf1317"
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
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }]
      }
      """

  Scenario: Create user attribute
    Given I get file "features/data/create-user-attribute-group-invalid-request.response.json" content and remember as "response" with placeholders
    When I send a POST request to "/api/{{businessId}}/attribute/group" with json:
      """
      {
      }
      """
    Then print last response
    Then the response status code should be 400
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Update user attribute
    Given I get file "features/data/update-user-attribute-group-invalid-request.response.json" content and remember as "response" with placeholders
    When I send a PATCH request to "/api/{{businessId}}/attribute/group/{{attributeGroupId}}" with json:
      """
      {
      }
      """
    Then print last response
    Then the response status code should be 400
    And the response should contain json:
      """
      {{response}}
      """

