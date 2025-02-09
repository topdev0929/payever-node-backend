Feature: Delete products
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

  Scenario: Delete product
    Given I use DB fixture "products/delete-product"
    When I send a DELETE request to "/api/business/{{businessId}}/products/{{productId}}"
    Then print last response
    And the response status code should be 200
    And model "Product" with id "{{productId}}" should not exist
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name": "marketplace.event.product-subscription.deleted",
          "payload": {
            "marketplaceProduct": {
              "id": "{{productId}}"
            },
            "business": {
              "id": "{{businessId}}"
            },
            "product": {
              "id": "11111111-1111-1111-1111-111111111111"
            }
          }
        },
        {
          "name": "marketplace.event.product-subscription.deleted",
          "payload": {
            "marketplaceProduct": {
              "id": "{{productId}}"
            },
            "business": {
              "id": "{{anotherBusinessId}}"
            },
            "product": {
              "id": "22222222-2222-2222-2222-222222222222"
            }
          }
        }
      ]
      """

  Scenario: Received request to delete product of another business
    Given I use DB fixture "products/delete-product"
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
    When I send a DELETE request to "/api/business/{{anotherBusinessId}}/products/{{productId}}"
    Then print last response
    And the response status code should be 403
    And model "Product" with id "{{productId}}" should contain json:
      """
      {
        "title": "product",
        "price": 100
      }
      """

