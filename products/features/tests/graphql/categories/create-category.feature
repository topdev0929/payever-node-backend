Feature: Categories GraphQL API. Create category
  Background:
    Given I remember as "newCategoryName" following value:
      """
      "new category"
      """
    And I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "rootParentCategoryId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
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

  Scenario: Create category
    When I send a GraphQL query to "/categories":
      """
      mutation {
        createCategory(
          dto: {
            name: "{{newCategoryName}}",
            description: "Description",
            businessId: "{{businessId}}",
            slug: "test_slug",
            attributes: [{
              name: "Color",
              type: "color",
              isDefault: true
            }]
        }) {
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
    When I get "data.createCategory.id" from response and remember as "newCategoryId"
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "data": {
          "createCategory": {
            "name": "new category",
            "business": {
              "id":  "{{businessId}}"
            },
            "attributes": [
              {
                "name": "Color",
                "type": "color"
              }
            ]
          }
        }
      }
      """
    And print RabbitMQ message list
    Then RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "products.event.category.created",
        "payload": {
          "_id": "*"
        }
      }
    ]
    """
    And model "Category" with id "{{newCategoryId}}" should contain json:
      """
      {
        "name": "{{newCategoryName}}",
        "businessId": "{{businessId}}"
      }
      """

  Scenario: Create category with parent
    Given I use DB fixture "graphql/create-categories/create-category-with-parent"
    When I send a GraphQL query to "/categories":
      """
       mutation {
        createCategory(
          dto: {
            name: "{{newCategoryName}}",
            description: "Description",
            businessId: "{{businessId}}",
            slug: "test_slug",
            attributes: [{
              name: "Color",
              type: "color",
              isDefault: true
            }]
            parent: "{{rootParentCategoryId}}"
        }) {
          id
          name
          business {
            id
          }
          attributes {
            name
            type
          }
          ancestors {
            id
          }
          parent {
            id
          }
        }
      }
      """
    Then print last response
    When I get "data.createCategory.id" from response and remember as "newCategoryId"
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "data": {
          "createCategory": {
            "name": "{{newCategoryName}}",
            "business": {
              "id": "{{businessId}}"
            },
            "parent": {
              "id": "{{rootParentCategoryId}}"
            },
            "attributes": [{
              "name": "Color",
              "type": "color"
            }],
            "ancestors": [
              {
                "id": "{{rootParentCategoryId}}"
              }
            ]
          }
        }
      }
      """
    And print RabbitMQ message list
    Then RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "products.event.category.created",
        "payload": {
          "_id": "*"
        }
      }
    ]
    """
    And model "Category" with id "{{newCategoryId}}" should contain json:
      """
      {
        "name": "{{newCategoryName}}",
        "businessId": "{{businessId}}",
        "ancestors": ["{{rootParentCategoryId}}"]
      }
      """

  Scenario: Try to create category to another business
    When I send a GraphQL query to "/categories":
      """
      mutation {
        createCategory(
          dto: {
            name: "{{newCategoryName}}",
            description: "Description",
            businessId: "{{wrongBusinessId}}",
            slug: "test_slug",
            attributes: [{
              name: "Color",
              type: "color",
              isDefault: true
            }]
        }) {
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
                "createCategory"
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

  Scenario: Try to create two categories with the same name
    When I send a GraphQL query to "/categories":
      """
      mutation {
        createCategory(
          dto: {
            name: "{{newCategoryName}}",
            description: "Description",
            businessId: "{{businessId}}",
            slug: "test_slug",
            attributes: [{
              name: "Color",
              type: "color",
              isDefault: true
            }]
        }) {
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
    When I send a GraphQL query to "/categories":
      """
      mutation {
        createCategory(
          dto: {
            name: "{{newCategoryName}}",
            description: "Description",
            businessId: "{{businessId}}",
            slug: "test_slug",
            attributes: [{
              name: "Color",
              type: "color",
              isDefault: true
            }]
        }) {
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
            "createCategory"
          ],
          "extensions": {
            "code": "INTERNAL_SERVER_ERROR",
            "exception": {
              "response": {
                "statusCode": 400,
                "message": [{
                    "constraints": {
                      "UniqueCategoryNameConstraint": "Category \"(new category)\" is already exists in business \"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb\""
                    }
                  }, {
                    "constraints": {
                      "UniqueCategorySlugConstraint": "Category with slug \"(test_slug)\" is already exists in business \"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb\""
                    }
                }],
                "error": "Bad Request"
              },
              "status": 400
            }
          }
        }]
      }
      """
