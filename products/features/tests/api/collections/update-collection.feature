Feature: Collections API. Update collection
  Background:
    Given I remember as "collectionId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "collectionBase" following value:
      """
      "7ff8b1b1-d6fb-4945-ae92-9e600a51d18c"
      """
    Given I remember as "collectionBase2" following value:
      """
      "416e3c22-5959-4cdb-9b1b-db5b942800c0"
      """
    Given I remember as "collectionChild" following value:
      """
      "0a5af4b4-357f-47aa-96d5-6960f51b5084"
      """
    Given I remember as "collectionChild2" following value:
      """
      "7b224952-d673-491d-88e4-8ae13acdaf6e"
      """
    Given I remember as "otherBusinessCollection" following value:
      """
      "367d1a3a-7010-44d1-b3ac-28a12cc8cb86"
      """
    And I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
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
    And I remember as "productId1" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    And I remember as "productId2" following value:
      """
      "22222222-2222-2222-2222-222222222222"
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

  Scenario: Updating collection
    Given I use DB fixture "api/collections/update-collection"
    When I send a PATCH request to "/collections/{{businessId}}/{{collectionId}}" with json:
      """
      {
        "name": "New name",
        "slug": "test_slug"
      }
      """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "name": "New name",
        "businessId": "{{businessId}}"
      }
      """
    And model "Collection" with id "{{collectionId}}" should contain json:
      """
      {
        "name": "New name",
        "businessId": "{{businessId}}"
      }
      """

  Scenario: Updating collection wrong business
    Given I use DB fixture "api/collections/update-collection"
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "roles": [{
          "name": "merchant",
          "permissions": [{"businessId": "{{otherBusinessCollection}}", "acls": []}]
        }]
      }
      """
    When I send a PATCH request to "/collections/{{otherBusinessCollection}}/{{collectionId}}" with json:
      """
      {
        "name": "New name",
        "slug": "test_slug"
      }
      """
    Then print last response
    Then the response status code should be 403

  Scenario: Updating collection parent
    Given I use DB fixture "api/collections/update-collection-with-parent"
    When I send a PATCH request to "/collections/{{businessId}}/{{collectionBase2}}" with json:
      """
      {
        "name": "New name",
        "slug": "test_slug",
        "parent": "{{collectionChild}}"
      }
      """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "name": "New name",
        "businessId": "{{businessId}}",
        "parent": "{{collectionChild}}",
        "ancestors": ["{{collectionBase}}", "{{collectionChild}}"]
      }
      """
    And model "Collection" with id "{{collectionBase2}}" should contain json:
      """
      {
        "name": "New name",
        "businessId": "{{businessId}}",
        "parent": "{{collectionChild}}",
        "ancestors": ["{{collectionBase}}", "{{collectionChild}}"]
      }
      """
    And model "Collection" with id "{{collectionChild2}}" should contain json:
      """
      {
        "name": "collection child2",
        "businessId": "{{businessId}}",
        "parent": "{{collectionBase2}}",
        "ancestors": ["{{collectionBase}}", "{{collectionChild}}", "{{collectionBase2}}"]
      }
      """

  Scenario: Updating collection with other business as parent
    Given I use DB fixture "api/collections/update-collection-with-parent"
    When I send a PATCH request to "/collections/{{businessId}}/{{collectionChild2}}" with json:
      """
      {
        "name": "New name",
        "slug": "test_slug",
        "parent": "{{otherBusinessCollection}}"
      }
      """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "name": "New name",
        "businessId": "{{businessId}}",
        "parent": "{{collectionBase2}}",
        "ancestors": ["{{collectionBase2}}"]
      }
      """
    And model "Collection" with id "{{collectionChild2}}" should contain json:
      """
      {
        "name": "New name",
        "businessId": "{{businessId}}",
        "parent": "{{collectionBase2}}",
        "ancestors": ["{{collectionBase2}}"]
      }
      """

  Scenario: Trying to update collection of another business
    Given I use DB fixture "api/collections/update-collection"
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
    When I send a PATCH request to "/collections/{{anotherBusiness}}/{{collectionId}}" with json:
      """
      {
        "name": "New name",
        "slug": "test_slug"
      }
      """
    Then print last response
    Then the response status code should be 403

  Scenario: Updating collection with the name of another collection
    Given I use DB fixture "api/collections/update-collection-name-already-exists"
    And I remember as "occupiedName" following value:
      """
      "Occupied name"
      """
    When I send a PATCH request to "/collections/{{businessId}}/{{collectionId}}" with json:
      """
      {
        "name": "{{occupiedName}}",
        "slug": "test_slug_2"
      }
      """
    Then print last response
    And the response status code should be 400
    And the response should contain json:
      """
      {
        "statusCode": 400,
        "message": "Validation failed",
        "errors": [
          {
            "value": "{{occupiedName}}",
            "property": "name",
            "children": [],
            "constraints": {
              "unique": "forms.error.validator.name.not_unique"
            }
          },
          {
            "property": "businessId",
            "children": [],
            "constraints": {
              "unique": "forms.error.validator.businessId.not_unique"
            }
          }
        ]
      }
      """

  Scenario: Updating collection with auto-fill
    Given I use DB fixture "api/collections/update-automatic-collection"
    And I mock Elasticsearch method "search" with:
      """
      {
       "arguments": [
         "products",
         {
           "query": {
             "bool": {
               "must": [
                 {
                   "match_phrase": {
                     "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
                   }
                 }
               ],
               "must_not": [
                 {
                   "has_child": {
                     "query": {
                       "bool": {
                         "must": [
                           {
                             "match_phrase": {
                               "title": "Test title"
                             }
                           }
                         ],
                         "must_not": [],
                         "should": []
                       }
                     },
                     "type": "variants"
                   }
                 }
               ],
               "should": []
             }
           },
           "stored_fields": []
         }
       ],
       "result": {
          "body": {
            "hits": {
              "hits": [
                {
                  "_id": "{{productId1}}"
                },
                {
                  "_id": "{{productId2}}"
                }
              ]
            }
          }
        }
      }
      """
    When I send a PATCH request to "/collections/{{businessId}}/{{collectionId}}" with json:
      """
      {
        "name": "New name",
        "slug": "test_slug",
        "automaticFillConditions": {
          "strict": true,
          "filters": [
            {
              "field": "variant_title",
              "fieldType": "string",
              "fieldCondition": "isNot",
              "value": "Test title"
            }
          ]
        }
      }
      """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "name": "New name",
        "business": "{{businessId}}"
      }
      """
    And model "Collection" with id "{{collectionId}}" should contain json:
      """
      {
        "name": "New name",
        "businessId": "{{businessId}}"
      }
      """
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

  Scenario: Updating collection with auto-fill and manual added products
    Given I use DB fixture "api/collections/update-automatic-collection-manual-products"
    And I mock Elasticsearch method "search" with:
      """
      {
       "arguments": [
         "products",
         {
           "query": {
             "bool": {
               "must": [
                 {
                   "match_phrase": {
                     "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
                   }
                 }
               ],
               "must_not": [
                 {
                   "has_child": {
                     "query": {
                       "bool": {
                         "must": [
                           {
                             "match_phrase": {
                               "title": "Test title"
                             }
                           }
                         ],
                         "must_not": [],
                         "should": []
                       }
                     },
                     "type": "variants"
                   }
                 }
               ],
               "should": []
             }
           },
           "stored_fields": []
         }
       ],
       "result": {
          "body": {
            "hits": {
              "hits": [
                {
                  "_id": "{{productId1}}"
                }
              ]
            }
          }
        }
      }
      """
    When I send a PATCH request to "/collections/{{businessId}}/{{collectionId}}" with json:
      """
      {
        "name": "New name",
        "slug": "test_slug",
        "automaticFillConditions": {
          "strict": true,
          "filters": [
            {
              "field": "variant_title",
              "fieldType": "string",
              "fieldCondition": "isNot",
              "value": "Test title"
            }
          ]
        }
      }
      """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "name": "New name",
        "businessId": "{{businessId}}"
      }
      """
    And model "Collection" with id "{{collectionId}}" should contain json:
      """
      {
        "name": "New name",
        "businessId": "{{businessId}}"
      }
      """
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

  Scenario: Updating collection with auto-fill, don't update conditions
    Given I use DB fixture "api/collections/update-automatic-collection"
    When I send a PATCH request to "/collections/{{businessId}}/{{collectionId}}" with json:
      """
      {
        "name": "New name",
        "slug": "test_slug"
      }
      """
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "name": "New name",
        "businessId": "{{businessId}}"
      }
      """
    And model "Collection" with id "{{collectionId}}" should contain json:
      """
      {
        "name": "New name",
        "businessId": "{{businessId}}"
      }
      """
