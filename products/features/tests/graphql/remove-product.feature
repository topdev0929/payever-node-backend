Feature: Remove a product
  Background:
    Given I use DB fixture "products"
    And I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "products",
          {}
         ],
        "result": {}
      }
      """
    And I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "products-folder",
          {}
         ],
        "result": {}
      }
      """

  Scenario: Remove a product as a merchant
    Given I authenticate as a user with the following data:
    """
    {
      "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
      "email": "merchant@example.com",
      "roles": [
        {"name": "user", "permissions": []},
        {
          "name": "merchant",
          "permissions": [
            {
              "businessId": "21f4947e-929a-11e9-bb05-7200004fe4c0",
              "acls": []
            }
          ]
        }
      ]
    }
    """

    When I send a GraphQL query to "/products":
      """
      mutation {deleteProduct(ids: ["3799bb06-929a-11e9-b5a6-7200004fe4c0"])}
      """

    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {"data": {
        "deleteProduct": 1
      }}
      """

  Scenario: Trying to remove a product as a merchant
    Given I authenticate as a user with the following data:
    """
    {
      "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
      "email": "merchant@example.com",
      "roles": [
        {"name": "user", "permissions": []},
        {
          "name": "merchant",
          "permissions": [
            {
              "businessId": "21f4947e-929a-11e9-bb05-7200004fe4c0",
              "acls": [{"microservice": "pos", "create": true}]
            }
          ]
        }
      ]
    }
    """
    When I send a GraphQL query to "/products":
      """
      mutation {deleteProduct(ids: ["3799bb06-929a-11e9-b5a6-7200004fe4c0"])}
      """

    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "errors":[
          {
            "extensions":{
              "exception":{
                "status":403,
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
