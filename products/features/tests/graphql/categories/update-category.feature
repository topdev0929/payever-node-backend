Feature: Categories GraphQL API. Update category
  Background:
    Given I remember as "businessId" following value:
      """
      "5f02c4a8-929a-11e9-812b-7200004fe4c0"
      """
    And I remember as "categoryId" following value:
      """
      "2ca4aa66-1fd0-4d65-9103-8c7c635d8426"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "643bffd4-4065-4d11-b555-4982d42dd45c"
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
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "product-category",
          {
          }
        ]
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

  Scenario: Updating category
    Given I use DB fixture "graphql/update-categories/update-category"
    When I send a GraphQL query to "/categories":
      """
      mutation {
        updateCategory(
          dto: {
            name: "New name",
            businessId: "{{businessId}}",
            slug: "test_slug",
            attributes: []
          },
          categoryId: "{{categoryId}}",
        ) {
          id
          name
          business {
            id
          }
          attributes {
            name
            type
          }
        }
      }
      """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "data": {
          "updateCategory": {
            "name": "New name",
            "business": {
              "id": "{{businessId}}"
            },
            "attributes": []
          }
        }
      }
      """
    And model "Category" with id "{{categoryId}}" should contain json:
      """
      {
        "name": "New name",
        "businessId": "{{businessId}}"
      }
      """
    And print RabbitMQ message list
    Then RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "products.event.category.updated",
        "payload": {
          "_id": "*"
        }
      }
    ]
    """

  Scenario: Trying to update category of another business
    Given I use DB fixture "graphql/update-categories/update-category"
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "{{anotherBusinessId}}", "acls": []}]
      }]
    }
    """
    When I send a GraphQL query to "/categories":
      """
      mutation {
        updateCategory(
          dto: {
            name: "New name",
            businessId: "{{anotherBusinessId}}",
            slug: "test_slug",
            attributes: []
          },
          categoryId: "{{categoryId}}",
        ) {
          id
          name
          business {
            id
          }
          attributes {
            name
            type
          }
        }
      }
      """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
         "errors": [
           {
              "message": "Access Denied",
              "locations": [{
                "line": 2,
                "column": 3
              }],
              "path": [
                "updateCategory"
              ],
              "extensions": {
                "code": "INTERNAL_SERVER_ERROR",
                "exception": {
                  "response": {
                    "statusCode": 403,
                    "message": "Access Denied",
                    "error": "Forbidden"
                  },
                  "status": 403,
                  "message": {
                    "statusCode": 403,
                    "message": "Access Denied",
                    "error": "Forbidden"
                   }
                }
              }
            }
          ]
       }
      """

  Scenario: Updating category with the name of another category
    Given I use DB fixture "graphql/update-categories/update-category"
    When I send a GraphQL query to "/categories":
      """
      mutation {
        updateCategory(
          dto: {
            name: "Category 2",
            businessId: "{{businessId}}",
            slug: "test_slug",
            attributes: []
          },
          categoryId: "{{categoryId}}",
        ) {
          id
          name
          business {
            id
          }
          attributes {
            name
            type
          }
        }
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "errors": [{
        "message": "Internal server error",
        "locations": [{
          "line": 2,
          "column": 3
        }],
        "path": [
          "updateCategory"
        ],
        "extensions": {
          "code": "INTERNAL_SERVER_ERROR",
          "exception": {
            "response": {
              "statusCode": 400,
              "message": [
                {
                  "constraints": {
                    "UniqueCategoryNameConstraint": "Category \"(Category 2)\" is already exists in business \"5f02c4a8-929a-11e9-812b-7200004fe4c0\""
                  }
                }
              ],
              "error": "Bad Request"
            },
            "status": 400
          }
        }
      }]
    }
    """
