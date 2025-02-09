Feature: User album features
  Background:
    Given I use DB fixture "user.media"
    Given I use DB fixture "user.album"
    Given I use DB fixture "business"
    Given I use DB fixture "user.attribute"
    Given I use DB fixture "user.attribute.group"
    Given I remember as "businessId" following value:
      """
        "08d30292-0b3c-4b5d-a6ec-93ba43d6c81d"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{userId}}",
        "email": "email@test.com",
        "roles": [{
          "name": "merchant",
          "permissions": [{"businessId": "{{businessId}}", "acls": []}]
        }]
      }
      """
    Given I remember as "albumId1Lvl0" following value:
      """
        "0ebb5ea6-61de-46f7-833f-599018b7861f"
      """
    Given I remember as "albumId1Lvl1" following value:
      """
        "256fa624-6f5d-40a1-94a6-d50fe913f653"
      """
    Given I remember as "albumId1Lvl2" following value:
      """
        "a03687bb-e7b0-434d-b871-0a7bdecd5c6e"
      """
    Given I remember as "albumId2Lvl0" following value:
      """
        "eb5913c8-6c81-49ae-a16d-9e89299dee5b"
      """
    Given I remember as "albumId2Lvl1" following value:
      """
        "bf9d575e-e954-4330-880a-4ba3569aebd5"
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

  Scenario: Create user album with no parent
    When I send a POST request to "/api/{{businessId}}/album" with json:
      """
      {
        "name": "new album",
        "businessId": "{{businessId}}",
        "description": "some description here"
      }
      """
    Then print last response
    Then I look for model "UserAlbum" by following JSON and remember as "savedAlbum":
      """
      {
        "ancestors": [],
        "businessId": "{{businessId}}",
        "description": "some description here",
        "name": "new album"
      }
      """
    And stored value "savedAlbum" should contain json:
      """
      {
        "_id": "*",
        "ancestors": [],
        "businessId": "{{businessId}}",
        "description": "some description here",
        "name": "new album"
      }
      """
    Then the response status code should be 201
    And the response should contain json:
      """
      {
        "_id": "*",
        "ancestors": [],
        "businessId": "{{businessId}}",
        "description": "some description here",
        "name": "new album",
        "createdAt": "*",
        "updatedAt": "*"
      }
      """

  Scenario: Create user album with parent
    When I send a POST request to "/api/{{businessId}}/album" with json:
      """
      {
        "name": "new album",
        "businessId": "{{businessId}}",
        "description": "some description here",
        "parent": "{{albumId1Lvl2}}"
      }
      """
    Then print last response
    Then I look for model "UserAlbum" by following JSON and remember as "savedAlbum":
      """
      {
        "businessId": "{{businessId}}",
        "description": "some description here",
        "name": "new album",
        "parent": "{{albumId1Lvl2}}"
      }
      """
    And stored value "savedAlbum" should contain json:
      """
      {
        "_id": "*",
        "ancestors": [
          "{{albumId1Lvl0}}",
          "{{albumId1Lvl1}}",
          "{{albumId1Lvl2}}"
        ],
        "businessId": "{{businessId}}",
        "description": "some description here",
        "name": "new album",
        "parent": "{{albumId1Lvl2}}"
      }
      """
    Then the response status code should be 201
    And the response should contain json:
      """
      {
        "_id": "*",
        "ancestors": [
          "{{albumId1Lvl0}}",
          "{{albumId1Lvl1}}",
          "{{albumId1Lvl2}}"
        ],
        "businessId": "{{businessId}}",
        "description": "some description here",
        "name": "new album",
        "parent": "{{albumId1Lvl2}}",
        "createdAt": "*",
        "updatedAt": "*"
      }
      """

  Scenario: Update user album will change its child if parent is changed
    When I send a PATCH request to "/api/{{businessId}}/album/{{albumId1Lvl1}}" with json:
      """
      {
        "albumId": "{{albumId1Lvl1}}",
        "businessId": "{{businessId}}",
        "description": "update description here",
        "name": "new album",
        "parent": "{{albumId2Lvl1}}"
      }
      """
    Then print last response
    Then I look for model "UserAlbum" by following JSON and remember as "savedAlbum":
      """
      {
        "_id": "{{albumId1Lvl1}}"
      }
      """
    And stored value "savedAlbum" should contain json:
      """
      {
        "_id": "{{albumId1Lvl1}}",
        "ancestors": ["{{albumId2Lvl0}}", "{{albumId2Lvl1}}"],
        "businessId": "{{businessId}}",
        "description": "update description here",
        "name": "new album",
        "parent": "{{albumId2Lvl1}}"
      }
      """
    Then I look for model "UserAlbum" by following JSON and remember as "childAlbum":
      """
      {
        "_id": "{{albumId1Lvl2}}"
      }
      """
    And stored value "childAlbum" should contain json:
      """
      {
        "_id": "{{albumId1Lvl2}}",
        "ancestors": ["{{albumId2Lvl0}}", "{{albumId2Lvl1}}", "{{albumId1Lvl1}}"],
        "businessId": "{{businessId}}",
        "parent": "{{albumId1Lvl1}}"
      }
      """
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "{{albumId1Lvl1}}",
        "ancestors": ["{{albumId2Lvl0}}", "{{albumId2Lvl1}}"],
        "businessId": "{{businessId}}",
        "name": "new album",
        "parent": "{{albumId2Lvl1}}",
        "createdAt": "*",
        "updatedAt": "*"
      }
      """

  Scenario: Get user album
    Given I get file "features/data/get-user-album-pagination.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/{{businessId}}/album?page=1&limit=3"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Get user album by id
    When I send a GET request to "/api/{{businessId}}/album/{{albumId1Lvl0}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "ancestors": [],
        "_id": "{{albumId1Lvl0}}",
        "businessId": "{{businessId}}",
        "createdAt": "2020-01-01T00:00:00.000Z",
        "name": "album 1 level 0",
        "updatedAt": "2020-01-01T00:00:00.000Z",
        "__v": 0
      }
      """

  Scenario: Get user album by parent
    When I send a GET request to "/api/{{businessId}}/album/parent/{{albumId1Lvl0}}?page=1&limit=3"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "ancestors": [
            "{{albumId1Lvl0}}"
          ],
          "_id": "{{albumId1Lvl1}}",
          "businessId": "{{businessId}}",
          "createdAt": "2020-01-01T00:00:00.000Z",
          "name": "album 1 level 1",
          "parent": "{{albumId1Lvl0}}",
          "updatedAt": "2020-01-01T00:00:00.000Z",
          "__v": 0
        }
      ]
      """

  Scenario: Get user album by ancestor
    Given I get file "features/data/get-user-album-by-ancestor.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/{{businessId}}/album/ancestor/{{albumId1Lvl0}}?page=1&limit=3"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Delete user album by id
    When I send a DELETE request to "/api/{{businessId}}/album/{{albumId1Lvl0}}"
    Then print last response
    Then the response status code should be 200
    And model "UserAlbum" with id "{{albumId1Lvl0}}" should not exist

  Scenario: Create user album with user attribute
    Given I get file "features/data/create-user-album-by-attribute.response.json" content and remember as "response" with placeholders
    When I send a POST request to "/api/{{businessId}}/album" with json:
      """
      {
        "name": "new album",
        "businessId": "{{businessId}}",
        "description": "some description here",
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
    Then I look for model "UserAlbum" by following JSON and remember as "savedAlbum":
      """
      {
        "ancestors": [],
        "businessId": "{{businessId}}",
        "description": "some description here",
        "name": "new album"
      }
      """
    And stored value "savedAlbum" should contain json:
      """
      {
        "_id": "*",
        "ancestors": [],
        "businessId": "{{businessId}}",
        "description": "some description here",
        "name": "new album",
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
        ]
      }
      """
    Then the response status code should be 201
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Update user album with user attribute
    Given I get file "features/data/update-user-album-by-attribute.response.json" content and remember as "response" with placeholders
    When I send a PATCH request to "/api/{{businessId}}/album/{{albumId1Lvl0}}" with json:
      """
      {
        "albumId": "{{albumId1Lvl0}}",
        "businessId": "{{businessId}}",
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
    Then I look for model "UserAlbum" by following JSON and remember as "savedAlbum":
      """
      {
        "_id": "{{albumId1Lvl0}}"
      }
      """
    And stored value "savedAlbum" should contain json:
      """
      {
        "_id": "{{albumId1Lvl0}}",
        "ancestors": [],
        "businessId": "{{businessId}}",
        "description": "some description",
        "name": "album 1 level 0",
        "userAttributes": [
          {
            "attribute": "{{userAttributeId}}",
            "value": "test1"
          },{
            "attribute": "{{userAttributeId2}}",
            "value": "honda"
          },{
            "attribute": "{{userAttributeId3}}",
            "value": "default"
          },{
            "attribute": "{{userAttributeId4}}",
            "value": "default"
          }
        ]
      }
      """
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Get user album by user attribute
    Given I get file "features/data/get-user-album-by-user-attribute.response.json" content and remember as "response" with placeholders
    When I send a GET request to "/api/{{businessId}}/album/by-user-attribute/{{userAttributeId}}/ford"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {{response}}
      """

  Scenario: Get user album by multiple user attribute
    Given I get file "features/data/get-user-album-by-user-attribute.response.json" content and remember as "response" with placeholders
    When I send a POST request to "/api/{{businessId}}/album/by-user-attribute" with json:
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
