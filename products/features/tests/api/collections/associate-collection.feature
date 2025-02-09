Feature: Collections API. Associate collection
  Background:
    Given I remember as "collectionId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "ffffffff-ffff-ffff-ffff-ffffffffffff"
      """
    And I remember as "productId1" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    And I remember as "productId2" following value:
      """
      "22222222-2222-2222-2222-222222222222"
      """
    And I remember as "anotherBusinessCollectionId" following value:
      """
      "dddddddd-dddd-dddd-dddd-dddddddddddd"
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
    And I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "products",
          {}
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "product-collection",
          { }
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "product-collection",
          { }
         ],
        "result": {}
      }
      """

  Scenario: Associating products batch
    Given I use DB fixture "api/collections/associate-collection"
    When I send a PUT request to "/collections/{{businessId}}/{{collectionId}}/products/associate" with json:
      """
      {
        "ids": [
          "{{productId1}}",
          "{{productId2}}"
        ]
      }
      """
    Then print last response
    Then the response status code should be 200
    And model "Product" with id "{{productId1}}" should contain json:
      """
      {
        "collections": ["{{collectionId}}"]
      }
      """
    And model "Product" with id "{{productId2}}" should contain json:
      """
      {
        "collections": ["{{collectionId}}"]
      }
      """

  Scenario: Associating products batch with automated collection
    Given I use DB fixture "api/collections/associate-automated-collection"
    When I send a PUT request to "/collections/{{businessId}}/{{collectionId}}/products/associate" with json:
      """
      {
        "ids": [
          "{{productId1}}",
          "{{productId2}}"
        ]
      }
      """
    Then print last response
    Then the response status code should be 200
    And model "Product" with id "{{productId1}}" should contain json:
      """
      {
        "collections": ["{{collectionId}}"]
      }
      """
    And model "Product" with id "{{productId2}}" should contain json:
      """
      {
        "collections": ["{{collectionId}}"]
      }
      """
    And model "Collection" with id "{{collectionId}}" should contain json:
      """
      {
        "automaticFillConditions": {
          "manualProductsList": [
            "{{productId1}}",
            "{{productId2}}"
          ]
        }
      }
      """

  Scenario: Associating products batch of another business collection
    Given I use DB fixture "api/collections/associate-collection"
    And I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "{{anotherBusinessId}}", "acls": []}]
      }]
    }
    """
    When I send a PUT request to "/collections/{{anotherBusinessId}}/{{collectionId}}/products/associate" with json:
      """
      {
        "ids": [
          "{{productId1}}",
          "{{productId2}}"
        ]
      }
      """
    Then print last response
    Then the response status code should be 403


  Scenario: Associating products batch of another business
    Given I use DB fixture "api/collections/associate-collection"
    And I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "{{anotherBusinessId}}", "acls": []}]
      }]
    }
    """
    When I send a PUT request to "/collections/{{anotherBusinessId}}/{{anotherBusinessCollectionId}}/products/associate" with json:
      """
      {
        "ids": [
          "{{productId1}}",
          "{{productId2}}"
        ]
      }
      """
    Then print last response
    Then the response status code should be 403
