Feature: Collections API. Create collection
  Background:
    Given I remember as "newCollectionName" following value:
      """
      "new collection"
      """
    And I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I remember as "parentId" following value:
      """
      "7ff8b1b1-d6fb-4945-ae92-9e600a51d18c"
      """
    And I remember as "parentId2" following value:
      """
      "ad76efe5-68bd-4834-8079-0a138685fbd9"
      """
    And I remember as "anotherParentId" following value:
      """
      "323748c8-7fc9-4389-ba9a-79fe99c2af8e"
      """
    And I remember as "productId1" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    And I remember as "productId2" following value:
      """
      "22222222-2222-2222-2222-222222222222"
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

  Scenario: Create collection
    When I send a POST request to "/collections/{{businessId}}" with json:
      """
      {
        "name": "{{newCollectionName}}",
        "slug": "test_slug",
        "activeSince": "Mon Apr 13 2020 09:45:37 GMT+0200",
        "channelSets": []
      }
      """
    Then print last response
    When I get "_id" from response and remember as "newCollectionId"
    Then the response status code should be 201
    And the response should contain json:
      """
      {
        "name": "{{newCollectionName}}",
        "businessId": "{{businessId}}"
      }
      """
    And model "Collection" with id "{{newCollectionId}}" should contain json:
      """
      {
        "name": "{{newCollectionName}}",
        "businessId": "{{businessId}}"
      }
      """

  Scenario: Create collection with parent
    Given I use DB fixture "api/collections/create-collection-with-parent"
    When I send a POST request to "/collections/{{businessId}}" with json:
      """
      {
        "name": "{{newCollectionName}}",
        "slug": "test_slug",
        "activeSince": "Mon Apr 13 2020 09:45:37 GMT+0200",
        "channelSets": [],
        "parent": "{{parentId}}"
      }
      """
    Then print last response
    When I get "_id" from response and remember as "newCollectionId"
    Then the response status code should be 201
    And the response should contain json:
      """
      {
        "name": "{{newCollectionName}}",
        "businessId": "{{businessId}}",
        "parent": "{{parentId}}",
        "ancestors": ["{{parentId2}}", "{{parentId}}"]
      }
      """
    And model "Collection" with id "{{newCollectionId}}" should contain json:
      """
      {
        "name": "{{newCollectionName}}",
        "businessId": "{{businessId}}",
        "parent": "{{parentId}}",
        "ancestors": ["{{parentId2}}", "{{parentId}}"]
      }
      """

  Scenario: Create collection with parent from another business
    Given I use DB fixture "api/collections/create-collection-with-parent"
    When I send a POST request to "/collections/{{businessId}}" with json:
      """
      {
        "name": "{{newCollectionName}}",
        "slug": "test_slug",
        "activeSince": "Mon Apr 13 2020 09:45:37 GMT+0200",
        "channelSets": [],
        "parent": "{{anotherParentId}}"
      }
      """
    Then print last response
    When I get "_id" from response and remember as "newCollectionId"
    Then the response status code should be 201
    And the response should contain json:
      """
      {
        "name": "{{newCollectionName}}",
        "businessId": "{{businessId}}",
        "ancestors": []
      }
      """
    And model "Collection" with id "{{newCollectionId}}" should contain json:
      """
      {
        "name": "{{newCollectionName}}",
        "businessId": "{{businessId}}",
        "ancestors": []
      }
      """

  Scenario: Create collection with non existing parent
    Given I use DB fixture "api/collections/create-collection-with-parent"
    When I send a POST request to "/collections/{{businessId}}" with json:
      """
      {
        "name": "{{newCollectionName}}",
        "slug": "test_slug",
        "activeSince": "Mon Apr 13 2020 09:45:37 GMT+0200",
        "channelSets": [],
        "parent": "non-exist-parent-id"
      }
      """
    Then print last response
    When I get "_id" from response and remember as "newCollectionId"
    Then the response status code should be 201
    And the response should contain json:
      """
      {
        "name": "{{newCollectionName}}",
        "business": "{{businessId}}",
        "ancestors": []
      }
      """
    And model "Collection" with id "{{newCollectionId}}" should contain json:
      """
      {
        "name": "{{newCollectionName}}",
        "businessId": "{{businessId}}",
        "ancestors": []
      }
      """

  Scenario: Try to create collection to another business
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
    When I send a POST request to "/collections/{{businessId}}" with json:
      """
      {
        "name": "New collection",
        "slug": "test_slug",
        "activeSince": "Mon Apr 13 2020 09:45:37 GMT+0200",
        "description": "Test collection description",
        "channelSets": []
      }
      """
    Then print last response
    Then the response status code should be 403

  Scenario: Try to create two collections with the same name
    When I send a POST request to "/collections/{{businessId}}" with json:
      """
      {
        "name": "{{newCollectionName}}",
        "slug": "test_slug",
        "activeSince": "Mon Apr 13 2020 09:45:37 GMT+0200",
        "description": "Test collection description",
        "channelSets": []
      }
      """
    When I send a POST request to "/collections/{{businessId}}" with json:
      """
      {
        "name": "{{newCollectionName}}",
        "slug": "test_slug",
        "activeSince": "Mon Apr 13 2020 09:45:37 GMT+0200",
        "description": "Test collection description",
        "channelSets": []
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
            "value": "{{newCollectionName}}",
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

  Scenario: Create collection with auto filling
    Given I use DB fixture "api/collections/create-automatic-collection"
    Given I mock Elasticsearch method "search" with:
      """
      {
       "arguments": [
         "products",
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "bool": {
                      "must": [],
                      "must_not": [],
                      "should": [
                        {
                          "bool": {
                            "must": [],
                            "must_not": [
                              {
                                "match_phrase": {
                                  "title": "Test title"
                                }
                              }
                            ],
                            "should": []
                          }
                        }
                      ]
                    }
                  },
                  {
                    "match_phrase": {
                      "businessId": "{{businessId}}"
                    }
                  }
                ],
                "must_not": [],
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
    When I send a POST request to "/collections/{{businessId}}" with json:
      """
      {
        "name": "{{newCollectionName}}",
        "slug": "test_slug",
        "activeSince": "Mon Apr 13 2020 09:45:37 GMT+0200",
        "description": "Test collection description",
        "channelSets": [],
        "automaticFillConditions": {
          "strict": false,
          "filters": [
            {
              "field": "title",
              "fieldType": "string",
              "fieldCondition": "isNot",
              "value": "Test title"
            }
          ]
        }
      }
      """
    Then print last response
    When I get "_id" from response and remember as "newCollectionId"
    Then the response status code should be 201
    And the response should contain json:
      """
      {
        "name": "{{newCollectionName}}",
        "description": "Test collection description",
        "businessId": "{{businessId}}"
      }
      """
    And model "Collection" with id "{{newCollectionId}}" should contain json:
      """
      {
        "name": "{{newCollectionName}}",
        "description": "Test collection description",
        "businessId": "{{businessId}}"
      }
      """
    And model "Product" with id "{{productId1}}" should contain json:
      """
      {
        "collections": ["{{newCollectionId}}"]
      }
      """
    And model "Product" with id "{{productId2}}" should contain json:
      """
      {
        "collections": ["{{newCollectionId}}"]
      }
      """
