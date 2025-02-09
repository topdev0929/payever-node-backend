Feature: Categories GraphQL API. Delete category
  Background:
    Given I remember as "businessId" following value:
      """
      "5f02c4a8-929a-11e9-812b-7200004fe4c0"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "643bffd4-4065-4d11-b555-4982d42dd45c"
      """
    And I remember as "categoryId" following value:
      """
      "2ca4aa66-1fd0-4d65-9103-8c7c635d8426"
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

  Scenario: Deleting category
    Given I use DB fixture "graphql/update-categories/update-category"
    Given I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "{{businessId}}", "acls": []}]
      }]
    }
    """
    When I send a GraphQL query to "/categories":
      """
      mutation {
        deleteCategory(
          categoryId: "{{categoryId}}"
        )
      }
      """
    Then print last response
    Then the response status code should be 200
    And model "Category" found by following JSON should not exist:
    """
    {
      "_id": "{{categoryId}}"
    }
    """
    And print RabbitMQ message list
    Then RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "products.event.category.removed",
        "payload": {
          "_id": "*"
        }
      }
    ]
    """

  Scenario: Trying to delete category of another business
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
        deleteCategory(
          categoryId: "{{categoryId}}"
        )
      }
      """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "errors": [{
          "message": "Access Denied",
          "locations": [{
            "line": 2,
            "column": 3
          }],
          "path": [
            "deleteCategory"
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
        }]
      }
      """