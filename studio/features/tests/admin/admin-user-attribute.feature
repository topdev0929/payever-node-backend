Feature: Admin user attribute features
  Background:
    Given I use DB fixture "user.attribute"
    Given I use DB fixture "business"
    Given I use DB fixture "user.media"
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
          "name": "admin",
          "permissions": []
        }]
      }
      """

  Scenario: Only admin role has access to admin endpoint
    Given I authenticate as a user with the following data:
      """
      {
        "roles": [
          {
            "name": "merchant"
          }
        ]
      }
      """
    When I send a GET request to "/api/admin/user-attributes"
    Then response status code should be 403

  Scenario: Create user attribute
    When I send a POST request to "/api/admin/user-attributes" with json:
      """
      {
    	"businessId": "{{businessId}}",
        "icon": "http://test.com/white.jpg",
        "name": "white",
        "type": "color"
      }
      """
    Then print last response
    Then I look for model "UserAttribute" by following JSON and remember as "savedAttribute":
      """
      {
        "businessId": "{{businessId}}",
        "icon": "http://test.com/white.jpg",
        "name": "white",
        "type": "color"
      }
      """
    And stored value "savedAttribute" should contain json:
      """
      {
        "_id": "*",
        "businessId": "{{businessId}}",
        "icon": "http://test.com/white.jpg",
        "name": "white",
        "type": "color",
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
        "icon": "http://test.com/white.jpg",
        "name": "white",
        "type": "color",
        "createdAt": "*",
        "updatedAt": "*"
      }
      """

  Scenario: Update user attribute
    When I send a PATCH request to "/api/admin/user-attributes/{{attributeId}}" with json:
      """
      {
        "businessId": "{{businessId}}",
        "icon": "http://test.com/white.jpg",
        "name": "white",
        "type": "color"
      }
      """
    Then print last response
    Then I look for model "UserAttribute" by following JSON and remember as "savedAttribute":
      """
      {
        "_id": "{{attributeId}}"
      }
      """
    And stored value "savedAttribute" should contain json:
      """
      {
        "_id": "*",
        "businessId": "{{businessId}}",
        "icon": "http://test.com/white.jpg",
        "name": "white",
        "type": "color",
        "createdAt": "*",
        "updatedAt": "*"
      }
      """
    And stored value "savedAttribute" should not contain json:
      """
      {
        "updatedAt": "2020-01-01T00:00:01.000Z"
      }
      """
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "*",
        "businessId": "{{businessId}}",
        "icon": "http://test.com/white.jpg",
        "name": "white",
        "type": "color",
        "createdAt": "*",
        "updatedAt": "*"
      }
      """

  Scenario: Get user attribute
    Given I get file "features/data/get-user-attribute-pagination.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/admin/user-attributes?businessIds={{businessId}}&page=1&limit=4"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "documents":{{response}}
      }
      """

  Scenario: Get type user attribute
    When I send a GET request to "/api/admin/user-attributes/type?businessId={{businessId}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
       ["vehicle", "animal"]
      """

  Scenario: Get user attribute by type
    Given I get file "features/data/get-user-attribute-by-type-pagination.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/admin/user-attributes?type=animal&businessIds={{businessId}}&page=1&limit=3"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "documents":{{response}}
      }      
      """

  Scenario: Get user attribute by id
    When I send a GET request to "/api/admin/user-attributes/{{attributeId}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
       {
         "_id": "{{attributeId}}",
         "icon": "http://test.com/car.jpg",
         "name": "car",
         "type": "vehicle",
         "createdAt": "2020-01-01T00:00:01.000Z",
         "updatedAt": "2020-01-01T00:00:01.000Z"
       }
      """

  Scenario: Delete user attribute by id
    When I send a DELETE request to "/api/admin/user-attributes/{{attributeId}}"
    Then print last response
    Then the response status code should be 200
    And model "UserAttribute" with id "{{attributeId}}" should not exist
    And model "UserMedia" with id "{{userMediaId}}" should contain json:
    """
    {
      "userAttributes": []
    }
    """
