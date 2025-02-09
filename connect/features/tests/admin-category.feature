Feature: Admin category
  Background: constants
    Given I remember as "categoryId" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """

    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "admin@payever.de",
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """

  Scenario: Create new category subscriptioin
    When I send a POST request to "/api/admin/categories" with json:
      """
      {
        "name": "my name",
        "icon": "my icon"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "name": "my name",
        "icon": "my icon"
      }
      """
    And store a response as "response"
    And model "Category" with id "{{response._id}}" should contain json:
      """
      {
        "name": "my name",
        "icon": "my icon"
      }
      """

  Scenario: Deny access for not admin role
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "admin@payever.de",
        "roles": []
      }
      """
    When I send a GET request to "/api/admin/categories"
    Then response status code should be 403


  Scenario: Update category
    Given I use DB fixture "integrations/category-create"
    When I send a PATCH request to "/api/admin/categories/{{categoryId}}" with json:
      """
      {
        "name": "new name",
        "icon": "new icon"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{categoryId}}",
        "name": "new name",
        "icon": "new icon"
      }      
      """
    And store a response as "response"
    And model "Category" with id "{{categoryId}}" should contain json:
      """
      {
        "_id": "{{categoryId}}",
        "name": "new name",
        "icon": "new icon"
      }
      """

  Scenario: get category by id
    Given I use DB fixture "integrations/category-create"
    When I send a GET request to "/api/admin/categories/{{categoryId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{categoryId}}"
      }
      """

  Scenario: get integratin subscriptions list
    Given I use DB fixture "integrations/category-create"
    When I send a GET request to "/api/admin/categories?businessIds={{businessId}}&limit=1"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "documents": [
          {
            "_id": "*"
          }
        ]
      }
      """

  Scenario: delete category
    Given I use DB fixture "integrations/category-create"
    When I send a DELETE request to "/api/admin/categories/{{categoryId}}"
    Then print last response
    And the response status code should be 200
    And model "Category" with id "{{categoryId}}" should not contain json:
      """
      {
        "_id": "{{categoryId}}"
      }
      """
