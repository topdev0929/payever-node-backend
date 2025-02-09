Feature: Collections API. Create collection
  Background:
    Given I remember as "newCollectionName" following value:
      """
      "new collection"
      """
    And I remember as "businessId" following value:
      """
      "21f4947e-929a-11e9-bb05-7200004fe4c0"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "5f02c4a8-929a-11e9-812b-7200004fe4c0"
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

  Scenario: Copy collection
    Given I use DB fixture "api/collections/copy-collection"
    When I send a POST request to "/collections/{{businessId}}/copy" with json:
      """
      {
        "collectionIds": [
          "74db030f-3a79-4b6d-9a2e-10f7588b93f1",
          "ba087e70-c5b2-45bc-b79c-8f1d456c8157"
        ]
      }
      """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
      """
      {
        "collections": [
          {
            "activeSince": "*",
            "businessId": "*",
            "name": "*-copy-1",
            "slug": "*-copy-1",
            "createdAt": "*",
            "updatedAt": "*",
            "__v": 0,
            "_id": "*"
          },
          {
            "activeSince": "*",
            "businessId": "*",
            "name": "*-copy-1",
            "slug": "*-copy-1",
            "createdAt": "*",
            "updatedAt": "*",
            "__v": 0,
            "_id": "*"
          }
        ],
        "info": {
          "pagination": {
            "page": 1,
            "pageCount": 1,
            "perPage": 2,
            "itemCount": 2
          }
        }
      }
      """

  Scenario: Copy collection with parent
    Given I use DB fixture "api/collections/copy-collection"
    When I send a POST request to "/collections/{{businessId}}/copy" with json:
      """
      {
        "collectionIds": [
          "74db030f-3a79-4b6d-9a2e-10f7588b93f1"
        ],
        "parent": "ba087e70-c5b2-45bc-b79c-8f1d456c8157"
      }
      """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
      """
      {
        "collections": [
          {
            "channelSets": [],
            "ancestors": [],
            "activeSince": "*",
            "businessId": "*",
            "parent": "ba087e70-c5b2-45bc-b79c-8f1d456c8157",
            "name": "*-copy-1",
            "slug": "*-copy-1",
            "createdAt": "*",
            "updatedAt": "*",
            "__v": 0,
            "_id": "*"
          }
        ],
        "info": {
          "pagination": {
            "page": 1,
            "pageCount": 1,
            "perPage": 1,
            "itemCount": 1
          }
        }
      }
      """

  Scenario: Copy collection with parent
    Given I use DB fixture "api/collections/copy-collection"
    When I send a POST request to "/collections/{{businessId}}/copy" with json:
      """
      {
        "collectionIds": [
          "74db030f-3a79-4b6d-9a2e-10f7588b93f1"
        ],
        "parent": "ba087e70-c5b2-45bc-b79c-8f1d456c8157",
        "prefix": "hurray"
      }
      """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
      """
      {
        "collections": [
          {
            "channelSets": [],
            "ancestors": [],
            "activeSince": "*",
            "businessId": "*",
            "parent": "ba087e70-c5b2-45bc-b79c-8f1d456c8157",
            "name": "*-hurray-1",
            "slug": "*-hurray-1",
            "createdAt": "*",
            "updatedAt": "*",
            "__v": 0,
            "_id": "*"
          }
        ],
        "info": {
          "pagination": {
            "page": 1,
            "pageCount": 1,
            "perPage": 1,
            "itemCount": 1
          }
        }
      }
      """

  Scenario: Copy collection from different business
    Given I use DB fixture "api/collections/copy-collection"
    When I send a POST request to "/collections/{{businessId}}/copy" with json:
      """
      {
        "collectionIds": [
          "db785216-fc2e-4fc6-8aa6-77bd1feead62"
        ],
        "parent": "ba087e70-c5b2-45bc-b79c-8f1d456c8157",
        "prefix": "hurray"
      }
      """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
      """
      {
        "collections": [],
        "info": {
          "pagination": {
            "page": 1,
            "pageCount": 1,
            "perPage": 0,
            "itemCount": 0
          }
        }
      }
      """

  Scenario: Copy collection to parent different business
    Given I use DB fixture "api/collections/copy-collection"
    When I send a POST request to "/collections/{{businessId}}/copy" with json:
      """
      {
        "collectionIds": [
          "ba087e70-c5b2-45bc-b79c-8f1d456c8157"
        ],
        "parent": "db785216-fc2e-4fc6-8aa6-77bd1feead62",
        "prefix": "hurray"
      }
      """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
      """
      {
        "collections": [
          {
            "channelSets": [],
            "ancestors": [],
            "activeSince": "*",
            "businessId": "*",
            "name": "*-hurray-1",
            "slug": "*-hurray-1",
            "createdAt": "*",
            "updatedAt": "*",
            "__v": 0,
            "_id": "*"
          }
        ],
        "info": {
          "pagination": {
            "page": 1,
            "pageCount": 1,
            "perPage": 1,
            "itemCount": 1
          }
        }
      }
      """
