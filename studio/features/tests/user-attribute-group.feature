Feature: Attribute features
  Background:
    Given I use DB fixture "user.attribute.group"
    Given I use DB fixture "business"
    Given I use DB fixture "user.media"
    Given I remember as "businessId" following value:
      """
        "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
      """
    Given I remember as "attributeGroupId" following value:
      """
        "71b50c01-129d-406b-b8b4-f82c3b95b4f4"
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

  Scenario: Create user attribute group
    When I send a POST request to "/api/{{businessId}}/attribute/group" with json:
      """
      {
    	"businessId": "{{businessId}}",
        "name": "media detail"
      }
      """
    Then print last response
    Then I look for model "UserAttributeGroup" by following JSON and remember as "savedAttributeGroup":
      """
      {
        "businessId": "{{businessId}}",
        "name": "media detail"
      }
      """
    And stored value "savedAttributeGroup" should contain json:
      """
      {
        "_id": "*",
        "businessId": "{{businessId}}",
        "name": "media detail",
        "createdAt": "*",
        "updatedAt": "*"
      }
      """
    Then the response status code should be 201
    And the response should contain json:
      """
      {
        "_id": "*",
        "businessId": "{{businessId}}",
        "name": "media detail",
        "createdAt": "*",
        "updatedAt": "*"
      }
      """

  Scenario: Update user attribute group
    When I send a PATCH request to "/api/{{businessId}}/attribute/group/{{attributeGroupId}}" with json:
      """
      {
        "businessId": "{{businessId}}",
        "name": "Detail Media"
      }
      """
    Then print last response
    Then I look for model "UserAttributeGroup" by following JSON and remember as "savedAttributeGroup":
      """
      {
        "_id": "{{attributeGroupId}}"
      }
      """
    And stored value "savedAttributeGroup" should contain json:
      """
      {
        "_id": "*",
        "businessId": "{{businessId}}",
        "name": "Detail Media",
        "createdAt": "*",
        "updatedAt": "*"
      }
      """
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "*",
        "businessId": "{{businessId}}",
        "name": "Detail Media",
        "createdAt": "*",
        "updatedAt": "*"
      }
      """

  Scenario: Get user attribute group
    When I send a GET request to "/api/{{businessId}}/attribute/group?page=1&limit=3"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "*",
          "businessId": "{{businessId}}",
          "name": "image detail",
          "createdAt": "*",
          "updatedAt": "*"
        }
      ]
      """

  Scenario: Get user attribute group by id
    When I send a GET request to "/api/{{businessId}}/attribute/group/{{attributeGroupId}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{attributeGroupId}}",
        "businessId": "{{businessId}}",
        "name": "image detail",
        "createdAt": "*",
        "updatedAt": "*"
      }
      """

  Scenario: Delete user attribute group by id
    When I send a DELETE request to "/api/{{businessId}}/attribute/group/{{attributeGroupId}}"
    Then print last response
    Then the response status code should be 200
    And model "UserAttributeGroup" with id "{{attributeGroupId}}" should not exist
