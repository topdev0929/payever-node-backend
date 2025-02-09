Feature: User media features
  Background:
    Given I use DB fixture "user.media"
    Given I use DB fixture "business"
    Given I use DB fixture "user.album"
    Given I use DB fixture "attribute"
    Given I use DB fixture "user.attribute"
    Given I use DB fixture "user.attribute.group"
    Given I remember as "businessId" following value:
      """
        "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
      """
    Given I remember as "businessIdSample" following value:
      """
        "78f54add-6317-4899-816f-a7fbc70f460b"
      """
    Given I remember as "userMediaId" following value:
      """
        "7d2a9404-e07a-477f-839d-71f591cf1317"
      """
    Given I remember as "attributeId" following value:
      """
        "64a19c1b-4ea0-4675-aafb-f50c2e3ab12d"
      """
    Given I remember as "userAttributeId" following value:
      """
        "17526ce8-94d3-4dab-99cd-667997bfa356"
      """
    Given I remember as "userAttributeId2" following value:
      """
        "541e9ae1-3119-4e0a-a34b-b37d662996b1"
      """
    Given I remember as "userAttributeId3" following value:
      """
        "c0c6d1c3-c6a3-4951-8cb4-7405b21c159d"
      """
    Given I remember as "userAttributeId4" following value:
      """
        "9e50b050-b769-4ad7-869a-929c4d1ddc2b"
      """
    Given I remember as "userAttributeGroupId" following value:
      """
        "71b50c01-129d-406b-b8b4-f82c3b95b4f4"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "email": "email@test.com",
        "roles": [{
          "name": "merchant",
          "permissions": [
            {"businessId": "{{businessId}}", "acls": []},
            {"businessId": "{{businessIdSample}}", "acls": []}
          ]
        }]
      }
      """
    Given I remember as "albumId1Lvl0" following value:
      """
        "0ebb5ea6-61de-46f7-833f-599018b7861f"
      """
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "studio-folder",
          {}
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "studio-folder",
          {}
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "studio-folder",
          {}
         ],
        "result": {}
      }
      """

  Scenario: Create user media
    When I send a POST request to "/api/{{businessId}}/media" with json:
      """
      {
        "url":"https://example.com/someimage.png",
        "mediaType": "image",
        "name": "user image 1",
        "businessId": "{{businessId}}",
        "albumId": "{{albumId1Lvl0}}",
        "attributes": [
          {
            "attribute": "{{attributeId}}",
            "value": "test1"
          }
        ],
        "userAttributes": [
          {
            "attribute": "{{userAttributeId}}",
            "value": "test1"
          }
        ],
    	"userAttributeGroups": ["{{userAttributeGroupId}}"]
      }
      """
    Then print last response
    Then I look for model "UserMedia" by following JSON and remember as "savedMedia":
      """
      {
        "url":"https://example.com/someimage.png",
        "mediaType": "image",
        "name": "user image 1"
      }
      """
    And stored value "savedMedia" should contain json:
      """
      {
        "_id": "*",
        "url":"https://example.com/someimage.png",
        "createdAt": "*",
        "mediaType": "image",
        "name": "user image 1",
        "album": "{{albumId1Lvl0}}",
        "attributes": [
          {
            "attribute": "{{attributeId}}",
            "value": "test1"
          }
        ],
        "userAttributes": [
          {
            "attribute": "{{userAttributeId}}",
            "value": "test1"
          },{
            "attribute": "{{userAttributeId2}}",
            "value": "default"
          },{
            "attribute": "{{userAttributeId3}}",
            "value": "default"
          },{
            "attribute": "{{userAttributeId4}}",
            "value": "default"
          }
        ],
        "updatedAt": "*"
      }
      """
    Then the response status code should be 201
    And the response should contain json:
      """
      {
        "userAttributes": [
          {
            "attribute": {
              "_id": "17526ce8-94d3-4dab-99cd-667997bfa356",
              "icon": "http://test.com/car.jpg",
              "name": "car",
              "type": "vehicle"
            },
            "value": "test1"
          }
        ],
        "_id": "*",
        "businessId": "{{businessId}}",
        "url": "https://example.com/someimage.png",
        "__v": 0,
        "album": "0ebb5ea6-61de-46f7-833f-599018b7861f",
        "attributes": [
          {
            "attribute": {
              "_id": "64a19c1b-4ea0-4675-aafb-f50c2e3ab12d",
              "icon": "http://test.com/car.jpg",
              "name": "car",
              "type": "vehicle"
            },
            "value": "test1"
          }
        ],
        "createdAt": "*",
        "mediaType": "image",
        "name": "user image 1",
        "updatedAt": "*"
      }
      """
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
         {
             "name": "studio.event.business-media.created",
             "payload": {
               "id": "*",
               "business": {
                 "id": "{{businessId}}"
               },
               "mediaType": "image",
               "name": "user image 1",
               "url": "https://example.com/someimage.png"
             }
           }
      ]
      """

  Scenario: Create new user media must remove sample user media
    When I send a POST request to "/api/{{businessIdSample}}/media" with json:
      """
      {
        "url":"https://example.com/someimage.png",
        "mediaType": "image",
        "name": "user image 1",
        "businessId": "{{businessIdSample}}"
      }
      """
    Then print last response
    Then model "UserMedia" found by following JSON should not exist:
      """
      {
        "businessId": "{{businessIdSample}}",
        "example": true
      }
      """

  Scenario: Get user media
    Given I get file "features/data/get-user-media-pagination.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/{{businessId}}/media?page=1&limit=3"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Search user media by name
    Given I get file "features/data/search-user-media.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/{{businessId}}/media/search?page=1&limit=3&name= 1"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Get user media by id
    When I send a GET request to "/api/{{businessId}}/media/{{userMediaId}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
       {
        "_id": "{{userMediaId}}",
        "url": "https://example.com/free-1.png",
        "mediaType": "image",
        "name": "image 1",
        "businessId": "*",
        "createdAt": "2020-01-01T00:00:01.000Z",
        "updatedAt": "2020-01-01T00:00:01.000Z"
      }
      """

  Scenario: Get user media by album id
    Given I get file "features/data/get-user-media-by-album.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/{{businessId}}/media/album/{{albumId1Lvl0}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Delete user media by id
    When I send a DELETE request to "/api/{{businessId}}/media/{{userMediaId}}"
    Then print last response
    Then the response status code should be 200
    And model "UserMedia" with id "{{userMediaId}}" should not exist
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
         {
             "name": "studio.event.business-media.deleted",
             "payload": {
               "id": "{{userMediaId}}",
               "business": {
                 "id": "{{businessId}}"
               }
             }
           }
      ]
      """

  Scenario: Get user media by user attribute
    Given I get file "features/data/get-user-media-by-user-attribute.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/{{businessId}}/media/by-user-attribute/{{userAttributeId}}/ford"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Get user media by multiple user attribute
    Given I get file "features/data/get-user-media-by-user-attribute.response.json" content and remember as "response" with placeholders
    When I send a POST request to "/api/{{businessId}}/media/by-user-attribute" with json:
      """
      {
        "attributes": [
          {
            "attribute": "{{userAttributeId}}",
            "value": "ford"
          },
          {
            "attribute": "{{userAttributeId2}}",
            "value": "honda"
          }
        ]
      }
      """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
      """
      {{response}}
      """
