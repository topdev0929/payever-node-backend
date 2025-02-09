Feature: Attribute features
  Background:
    Given I use DB fixture "subscription.media"
    Given I use DB fixture "attribute"
    Given I remember as "subscriptionMediaId" following value:
      """
        "7d2a9404-e07a-477f-839d-71f591cf1317"
      """
    Given I remember as "attributeId" following value:
      """
        "64a19c1b-4ea0-4675-aafb-f50c2e3ab12d"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "email": "email@test.com",
        "roles": [{
          "name": "admin"
        }]
      }
      """

  Scenario: Create attribute
    When I send a POST request to "/api/attribute" with json:
      """
      {
        "icon": "http://test.com/white.jpg",
        "name": "white",
        "type": "color"
      }
      """
    Then print last response
    Then I look for model "Attribute" by following JSON and remember as "savedAttribute":
      """
      {
        "icon": "http://test.com/white.jpg",
        "name": "white",
        "type": "color"
      }
      """
    And stored value "savedAttribute" should contain json:
      """
      {
        "_id": "*",
        "icon": "http://test.com/white.jpg",
        "name": "white",
        "type": "color",
        "createdAt": "*",
        "updatedAt": "*"
      }
      """
    Then the response status code should be 201
    And the response should contain json:
      """
      {
        "_id": "*",
        "icon": "http://test.com/white.jpg",
        "name": "white",
        "type": "color",
        "createdAt": "*",
        "updatedAt": "*"
      }
      """

  Scenario: Create new attribute must remove sample attribute
    When I send a POST request to "/api/{{businessIdSample}}/attribute" with json:
      """
      {
        "name": "white",
        "type": "color"
      }
      """
    Then model "Attribute" found by following JSON should not exist:
      """
      {
        "business": "{{businessIdSample}}",
        "example": true
      }
      """

  Scenario: Update attribute
    When I send a PATCH request to "/api/attribute/{{attributeId}}" with json:
      """
      {
        "icon": "http://test.com/white.jpg",
        "name": "white",
        "type": "color"
      }
      """
    Then print last response
    Then I look for model "Attribute" by following JSON and remember as "savedAttribute":
      """
      {
        "icon": "http://test.com/white.jpg",
        "name": "white",
        "type": "color"
      }
      """
    And stored value "savedAttribute" should contain json:
      """
      {
        "_id": "*",
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
        "icon": "http://test.com/white.jpg",
        "name": "white",
        "type": "color",
        "createdAt": "*",
        "updatedAt": "*"
      }
      """

  Scenario: Get attribute
    Given I get file "features/data/get-attribute-pagination.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/attribute?page=1&limit=3"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Get type attribute
    When I send a GET request to "/api/attribute/type"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
       ["vehicle", "animal"]
      """

  Scenario: Get attribute by type
    Given I get file "features/data/get-attribute-by-type-pagination.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/attribute/type/vehicle?page=1&limit=3"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Get attribute by id
    When I send a GET request to "/api/attribute/{{attributeId}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
       {
         "_id": "64a19c1b-4ea0-4675-aafb-f50c2e3ab12d",
         "icon": "http://test.com/car.jpg",
         "name": "car",
         "type": "vehicle",
         "createdAt": "2020-01-01T00:00:01.000Z",
         "updatedAt": "2020-01-01T00:00:01.000Z"
       }
      """

  Scenario: Delete attribute by id
    When I send a DELETE request to "/api/attribute/{{attributeId}}"
    Then print last response
    Then the response status code should be 200
    And model "Attribute" with id "{{attributeId}}" should not exist
    And model "SubscriptionMedia" with id "{{subscriptionMediaId}}" should contain json:
    """
    {
      "attributes": []
    }
    """
