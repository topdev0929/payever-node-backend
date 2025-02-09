Feature: Collections API. Get collections list
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
    And I remember as "channelSet_1" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    And I remember as "channelSet_2" following value:
      """
      "22222222-2222-2222-2222-222222222222"
      """
    And I remember as "channelSet_3" following value:
      """
      "33333333-3333-3333-3333-333333333333"
      """
    And I remember as "parentId" following value:
      """
      "ad76efe5-68bd-4834-8079-0a138685fbd9"
      """
    And I remember as "ancestorId" following value:
      """
      "416e3c22-5959-4cdb-9b1b-db5b942800c0"
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
    And I mock an axios request with parameters:
      """
      {
        "request": {
           "method": "post",
           "url": "http://localhost:3700/api/business/21f4947e-929a-11e9-bb05-7200004fe4c0/inventory/sku/stock",
           "body": "{\"skus\":[\"*\"]}",
           "headers": {
             "Accept": "application/json, text/plain, */*",
             "Content-Type": "application/json;charset=utf-8"
           }
        },
        "response": {
          "*": 100
        }
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

  Scenario: Get all collections
    Given I use DB fixture "api/collections/list-collections"
    When I send a GET request to "/collections/{{businessId}}?perPage=10&page=1"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "collections": [
          {
            "channelSets": [
              "{{channelSet_1}}",
              "{{channelSet_2}}"
            ],
            "_id": "*",
            "businessId": "{{businessId}}",
            "activeSince": "*",
            "name": "Collection 1",
            "slug": "*",
            "createdAt": "*",
            "updatedAt": "*",
            "__v": "0"
          },
          {
            "channelSets": [
              "{{channelSet_1}}"
            ],
            "_id": "*",
            "activeSince": "*",
            "businessId": "{{businessId}}",
            "name": "channel Set 1",
            "slug": "*",
            "activeTill": "*",
            "createdAt": "*",
            "updatedAt": "*",
            "__v": "0"
          },
          {
            "channelSets": [
              "{{channelSet_2}}"
            ],
            "_id": "*",
            "activeSince": "*",
            "businessId": "{{businessId}}",
            "name": "channel Set 2",
            "slug": "*",
            "activeTill": "*",
            "createdAt": "*",
            "updatedAt": "*",
            "__v": "0"
          },
          {
            "channelSets": [
              "{{channelSet_1}}",
              "{{channelSet_2}}"
            ],
            "_id": "*",
            "activeSince": "*",
            "businessId": "{{businessId}}",
            "name": "Collection 2",
            "slug": "*",
            "createdAt": "*",
            "updatedAt": "*",
            "__v": "0"
          }
        ],
        "info": {
          "pagination": {
            "perPage": 10,
            "itemCount": 4,
            "pageCount": 1,
            "page": 1
          }
        }
      }
      """

  Scenario: Get paginated collections
    Given I use DB fixture "api/collections/list-collections"
    When I send a GET request to "/collections/{{businessId}}?perPage=2&page=2"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "collections": [
          {
            "channelSets": [
              "{{channelSet_2}}"
            ],
            "_id": "*",
            "activeSince": "*",
            "businessId": "{{businessId}}",
            "name": "channel Set 2",
            "slug": "*",
            "activeTill": "*",
            "createdAt": "*",
            "updatedAt": "*",
            "__v": "0"
          },
          {
            "channelSets": [
              "{{channelSet_1}}",
              "{{channelSet_2}}"
            ],
            "_id": "*",
            "activeSince": "*",
            "businessId": "{{businessId}}",
            "name": "Collection 2",
            "slug": "*",
            "createdAt": "*",
            "updatedAt": "*",
            "__v": "0"
          }
        ],
        "info": {
          "pagination": {
            "perPage": 2,
            "itemCount": 4,
            "pageCount": 2,
            "page": 2
          }
        }
      }
      """

  Scenario: List active collections
    Given I use DB fixture "api/collections/list-collections"
    And I am not authenticated
    When I send a GET request to "/collections/{{businessId}}/active/{{channelSet_1}}?activeSince=2020-04-13T12:16:00.000Z&activeTill=2020-04-14T00:00:00.000Z&perPage=10&page=1"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "collections": [
          {
            "channelSets": [
              "{{channelSet_1}}"
            ],
            "_id": "*",
            "activeSince": "*",
            "businessId": "{{businessId}}",
            "name": "channel Set 1",
            "slug": "*",
            "activeTill": "*",
            "createdAt": "*",
            "updatedAt": "*",
            "__v": "0"
          }
        ],
        "info": {
          "pagination": {
            "perPage": 10,
            "itemCount": 1,
            "pageCount": 1,
            "page": 1
          }
        }
      }
      """

  Scenario: Get base collections
    Given I use DB fixture "api/collections/list-collection-with-parent"
    When I send a GET request to "/collections/{{businessId}}/base?perPage=10&page=1"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "collections": [
          {
            "_id": "416e3c22-5959-4cdb-9b1b-db5b942800c0",
            "name": "collection base",
            "productCount": 0
          }
        ],
        "info": {
          "pagination": {
            "itemCount": 1,
            "page": 1,
            "pageCount": 1,
            "perPage": 10
          }
        }
      }
      """

  Scenario: Get all collections by parent
    Given I use DB fixture "api/collections/list-collection-with-parent"
    When I send a GET request to "/collections/{{businessId}}/parent/{{parentId}}?perPage=10&page=1"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "collections": [
          {
            "ancestors": [
              "416e3c22-5959-4cdb-9b1b-db5b942800c0",
              "ad76efe5-68bd-4834-8079-0a138685fbd9"
            ],
            "_id": "7ff8b1b1-d6fb-4945-ae92-9e600a51d18c",
            "name": "collection child",
            "parent": "ad76efe5-68bd-4834-8079-0a138685fbd9",
            "productCount": 0
          }
        ],
        "info": {
          "pagination": {
            "itemCount": 1,
            "page": 1,
            "pageCount": 1,
            "perPage": 10
          }
        }
      }
      """

  Scenario: Get all collections by ancestor
    Given I use DB fixture "api/collections/list-collection-with-parent"
    When I send a GET request to "/collections/{{businessId}}/ancestor/{{ancestorId}}?perPage=10&page=1"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "collections": [
          {
            "channelSets": [],
            "ancestors": [
              "416e3c22-5959-4cdb-9b1b-db5b942800c0"
            ],
            "_id": "ad76efe5-68bd-4834-8079-0a138685fbd9",
            "activeSince": "*",
            "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
            "name": "collection parent",
            "slug": "collection_parent",
            "parent": "416e3c22-5959-4cdb-9b1b-db5b942800c0"
          },
          {
            "channelSets": [],
            "ancestors": [
              "416e3c22-5959-4cdb-9b1b-db5b942800c0",
              "ad76efe5-68bd-4834-8079-0a138685fbd9"
            ],
            "_id": "7ff8b1b1-d6fb-4945-ae92-9e600a51d18c",
            "activeSince": "*",
            "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
            "name": "collection child",
            "slug": "collection_child",
            "parent": "ad76efe5-68bd-4834-8079-0a138685fbd9"
          }
        ],
        "info": {
          "pagination": {
            "itemCount": 2,
            "page": 1,
            "pageCount": 1,
            "perPage": 10
          }
        }
      }
      """

  Scenario: Get collection by id
    Given I use DB fixture "api/collections/list-collection-with-parent"
    When I send a GET request to "/collections/{{businessId}}/{{parentId}}?perPage=10&page=1"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "channelSets": [],
        "ancestors": [
          "416e3c22-5959-4cdb-9b1b-db5b942800c0"
        ],
        "_id": "ad76efe5-68bd-4834-8079-0a138685fbd9",
        "activeSince": "*",
        "businessId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "name": "collection parent",
        "slug": "collection_parent",
        "parent": "416e3c22-5959-4cdb-9b1b-db5b942800c0"
      }
      """

  Scenario: Get collection by id with invalid businessId
    Given I use DB fixture "api/collections/list-collection-with-parent"
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
    When I send a GET request to "/collections/{{anotherBusinessId}}/{{parentId}}?perPage=10&page=1"
    Then print last response
    Then the response status code should be 404
