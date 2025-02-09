Feature: Attribute features
  Background:
    Given I use DB fixture "user.attribute"
    Given I use DB fixture "business"
    Given I remember as "businessId" following value:
      """
        "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
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
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }]
      }
      """

  Scenario: Create user attribute
    Given I get file "features/data/create-user-attribute-invalid-request.response.json" content and remember as "response" with placeholders
    When I send a POST request to "/api/{{businessId}}/attribute" with json:
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
    Given I get file "features/data/update-user-attribute-invalid-request.response.json" content and remember as "response" with placeholders
    When I send a PATCH request to "/api/{{businessId}}/attribute/{{attributeId}}" with json:
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

