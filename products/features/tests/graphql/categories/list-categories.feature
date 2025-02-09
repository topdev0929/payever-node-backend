Feature: Categories GraphQL API. Get categories list
  Background:
    Given I remember as "businessId" following value:
      """
      "5f02c4a8-929a-11e9-812b-7200004fe4c0"
      """
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [{
          "name": "merchant",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }]
      }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "product-category",
          {
          }
        ]
      }
      """

  Scenario: Get all categories
    Given I use DB fixture "graphql/get-categories/list-categories"
    And I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "product-category",
          {}
         ],
        "result": {}
      }
      """
    When I send a GraphQL query to "/categories":
      """
      {
        listCategories(
          dto: {
            businessId: "{{businessId}}"
          }
        ) {
          id
          name
          attributes {
            name
            type
          }
          slug
          image
          description
        }
      }
      """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "data": {
          "listCategories": [
            {
              "id": "2ca4aa66-1fd0-4d65-9103-8c7c635d8426",
              "name": "Category 1",
              "attributes": [],
              "slug": "category_1"
            },
            {
              "id": "651d8c62-d9df-4c1f-8a36-307173d77d46",
              "name": "Category to find by name",
              "attributes": [],
              "slug": "category_to_find_by_name"
            }
          ]
        }
      }
      """

  Scenario: Search category by name
    Given I use DB fixture "graphql/get-categories/list-categories"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [{
          "name": "merchant",
          "permissions": [{"businessId": "5f02c4a8-929a-11e9-812b-7200004fe4c0", "acls": []}]
        }]
      }
      """
    When I send a GraphQL query to "/categories":
      """
      {
        listCategories(
          dto: {
            businessId: "{{businessId}}"
            name: "find"
          }
        ) {
          id
          name
          attributes {
            name
            type
          }
          slug
          image
          description
        }
      }
      """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "data": {
          "listCategories": [
            {
              "id": "651d8c62-d9df-4c1f-8a36-307173d77d46",
              "name": "Category to find by name",
              "attributes": [],
              "slug": "category_to_find_by_name"
            }
          ]
        }
      }
      """
