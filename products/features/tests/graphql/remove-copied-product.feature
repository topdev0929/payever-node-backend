Feature: Remove a product
  Description: The purpose of this feature is to test the removal of a copied product and ensure that the data of the original product remains intact.

  Background:
    Given I use DB fixture "graphql/remove-copied-product/product-with-variant"
    Given I remember as "businessId" following value:
      """
      "21f4947e-929a-11e9-bb05-7200004fe4c0"
      """
    Given I remember as "originalProductId" following value:
      """
      "e8d3486e-43f6-4a4d-a65e-2c991051786f"
      """
    Given I remember as "variantId1" following value:
      """
      "dd5ddc0a-0672-40e3-8545-8c7f6c6dbf46"
      """
    Given I remember as "variantId2" following value:
      """
      "85b02a39-7bee-4072-b63c-d77f6c6dbf46"
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

  Scenario: Remove newly duplicated product and variants need to be intact in the original product
    When I send a GraphQL query to "/products":
      """
      mutation {
        copyProducts(
          businessId: "{{businessId}}"
          productIds: ["{{originalProductId}}"]
          targetFolderId: null,
          prefix: "duplicate"
        ) {
          products {
            id
            title
          }
        }
      }
      """
    Then print last response
    Then I get "data" from response and remember as "response"
    Then the response status code should be 200
    When I send a GraphQL query to "/products":
      """
      mutation {deleteProduct(ids: ["{{response.copyProducts.products.0.id}}"])}
      """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {"data": {
        "deleteProduct": 1
      }}
      """
    Then I send a GraphQL query to "/products":
      """
      {
        getProducts(
          includeIds: ["{{originalProductId}}"],
          paginationLimit: 10,
        ) {
          products {
            title
            variants {
              id
            }
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
          "getProducts": {
            "products": [
              {
                "title": "Original",
                "variants": [
                  {
                    "id": "{{variantId1}}"
                  },
                  {
                    "id": "{{variantId2}}"
                  }
                ]
              }
            ]
          }
        }
      }
      """
