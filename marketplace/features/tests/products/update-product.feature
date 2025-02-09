Feature: Update products
  Background:
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["marketplace-folder", []], "result": [] }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      { "arguments": ["marketplace-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "search" with:
      """
      { "arguments": ["marketplace-folder"], "result": [] }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      { "arguments": ["marketplace-folder"], "result": [] }
      """
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
        "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    And I remember as "productId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario: Received update product request
    Given I use DB fixture "products/update-product"
    When I send a PATCH request to "/api/business/{{businessId}}/products/{{productId}}" with json:
      """
      {
        "price": 300,
        "title": "Some product",
        "type": "physical"
      }
      """
    Then print last response
    And the response status code should be 200
    And model "Product" with id "{{productId}}" should contain json:
      """
      {
        "price": 300,
        "title": "Some product",
        "businessId": "{{businessId}}"
      }
      """

  Scenario: Received request to update product of another business
    Given I use DB fixture "products/update-product"
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{anotherBusinessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a PATCH request to "/api/business/{{anotherBusinessId}}/products/{{productId}}" with json:
      """
      {
        "price": 300,
        "title": "Some product",
        "type": "physical"
      }
      """
    Then print last response
    And the response status code should be 403
