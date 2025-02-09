Feature: Create products
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
    Given I remember as "productId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I authenticate as a user with the following data:
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

  Scenario: Received create product request
    Given I use DB fixture "products/create-product"
    When I send a POST request to "/api/business/{{businessId}}/products" with json:
      """
      {
        "id": "{{productId}}",
        "price": 100,
        "title": "Some product",
        "type": "physical"
      }
      """
    Then print last response
    And the response status code should be 201
    And model "Product" with id "{{productId}}" should contain json:
      """
      {
        "price": 100,
        "title": "Some product",
        "businessId": "{{businessId}}",
        "channelSet": "*"
      }
      """

  Scenario: Received create product request, product already exists
    Given I use DB fixture "products/create-product-already-exists"
    When I send a POST request to "/api/business/{{businessId}}/products" with json:
      """
      {
        "id": "{{productId}}",
        "price": 400,
        "title": "Some product",
        "type": "physical"
      }
      """
    Then print last response
    And the response status code should be 400
