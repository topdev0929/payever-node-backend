Feature: Collections API. Delete collections
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
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    And I remember as "anotherCollectionId" following value:
      """
      "dddddddd-dddd-dddd-dddd-dddddddddddd"
      """
    And I remember as "productId1" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    And I remember as "productId2" following value:
      """
      "22222222-2222-2222-2222-222222222222"
      """
    And I remember as "collectionBase" following value:
      """
      "7ff8b1b1-d6fb-4945-ae92-9e600a51d18c"
      """
    And I remember as "collectionChild" following value:
      """
      "0a5af4b4-357f-47aa-96d5-6960f51b5084"
      """
    And I remember as "collectionChild2" following value:
      """
      "7b224952-d673-491d-88e4-8ae13acdaf6e"
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

  Scenario: Deleting collection
    Given I use DB fixture "api/collections/delete-collection"
    When I send a DELETE request to "/collections/{{businessId}}/{{collectionId}}"
    Then print last response
    Then the response status code should be 200
    And model "Collection" found by following JSON should not exist:
      """
      {
        "_id": "{{collectionId}}"
      }
      """
    And model "Product" with id "{{productId1}}" should not contain json:
      """
      {
        "collections": ["{{collectionId}}"]
      }
      """
    And model "Product" with id "{{productId2}}" should not contain json:
      """
      {
        "collections": ["{{collectionId}}"]
      }
      """
    And model "Product" with id "{{productId1}}" should contain json:
      """
      {
        "collections": ["{{anotherCollectionId}}"]
      }
      """

  Scenario: Deleting collection parent
    Given I use DB fixture "api/collections/delete-collection-with-parent"
    When I send a DELETE request to "/collections/{{businessId}}/{{collectionBase}}"
    Then print last response
    Then the response status code should be 200
    And model "Collection" with id "{{collectionBase}}" should not exist
    And model "Collection" with id "{{collectionChild}}" should not exist
    And model "Collection" with id "{{collectionChild2}}" should not exist

  Scenario: Trying to delete collection of another business
    Given I use DB fixture "api/collections/delete-collection"
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
    When I send a DELETE request to "/collections/{{anotherBusinessId}}/{{collectionId}}"
    Then print last response
    Then the response status code should be 403

  Scenario: Deleting list of collections
    Given I use DB fixture "api/collections/delete-collection"
    When I send a DELETE request to "/collections/{{businessId}}/list" with json:
      """
      {
        "ids": [
          "{{collectionId}}"
        ]
      }
      """
    Then print last response
    Then the response status code should be 200
    And model "Collection" found by following JSON should not exist:
      """
      {
        "_id": "{{collectionId}}"
      }
      """
    And model "Product" with id "{{productId1}}" should not contain json:
      """
      {
        "collections": ["{{collectionId}}"]
      }
      """
    And model "Product" with id "{{productId2}}" should not contain json:
      """
      {
        "collections": ["{{collectionId}}"]
      }
     """
    And model "Product" with id "{{productId1}}" should contain json:
      """
      {
        "collections": ["{{anotherCollectionId}}"]
      }
      """

  Scenario: Trying to delete collection of another business
    Given I use DB fixture "api/collections/delete-collection"
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
    When I send a DELETE request to "/collections/{{anotherBusinessId}}/list" with json:
      """
      {
        "ids": [
          "{{anotherCollectionId}}",
          "{{collectionId}}"
        ]
      }
      """
    Then print last response
    Then the response status code should be 403
